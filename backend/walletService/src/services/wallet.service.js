const pool = require("../database/db");
const jwt = require("jsonwebtoken");
const { ethers } = require("ethers");
const crypto = require("crypto");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/env");
const { verifyWeb3AuthToken } = require("./web3auth.service");

const isMissingTableError = (error) => error?.code === "42P01";

// 🔹 Generate secure nonce
function generateNonce() {
  return crypto.randomBytes(32).toString("hex");
}

// 🔹 Generate Nonce
exports.generateNonce = async (address) => {
  if (!address) {
    throw { status: 400, message: "Wallet address required" };
  }

  const normalized = address.toLowerCase();
  const nonce = generateNonce();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await pool.query(
    `
    INSERT INTO wallet_nonces (address, nonce, expires_at)
    VALUES ($1, $2, $3)
    ON CONFLICT (address)
    DO UPDATE SET nonce=$2, expires_at=$3
    `,
    [normalized, nonce, expiresAt]
  );

  return nonce;
};

// 🔹 Register Wallet (Web3Auth Version)
exports.registerWallet = async ({
  idToken,
  walletAddress,
  signature,
  nonce,
}) => {

  if (!idToken || !walletAddress || !signature || !nonce) {
    throw { status: 400, message: "Missing required fields" };
  }

  const normalizedAddress = walletAddress.toLowerCase();

  // 1️⃣ Verify Web3Auth idToken
  let decoded;
  try {
    decoded = await verifyWeb3AuthToken(idToken);
  } catch (error) {
    throw {
      status: 401,
      message: `Invalid Web3Auth token: ${error.message || "verification failed"}`,
    };
  }

  const email = decoded?.email || decoded?.verifierId || null;

  if (!email && !decoded?.sub && !decoded?.u_id) {
    throw { status: 400, message: "User identity not found in token" };
  }

  // 2️⃣ Resolve local user id (prefer DB user, fallback to token identity)
  let u_id = decoded?.u_id || decoded?.sub || email;

  if (email) {
    try {
      const userResult = await pool.query(
        "SELECT u_id FROM users WHERE email=$1 LIMIT 1",
        [email]
      );

      if (userResult.rows.length > 0) {
        u_id = userResult.rows[0].u_id;
      }
    } catch (error) {
      // If users table is not present in this service DB, continue with token identity fallback.
      if (!isMissingTableError(error)) {
        throw error;
      }
    }
  }

  // 3️⃣ Fetch nonce
  const nonceResult = await pool.query(
    "SELECT nonce, expires_at FROM wallet_nonces WHERE address=$1",
    [normalizedAddress]
  );

  if (nonceResult.rows.length === 0) {
    throw { status: 400, message: "Nonce not found" };
  }

  const storedNonce = nonceResult.rows[0].nonce;
  const expiresAt = nonceResult.rows[0].expires_at;

  if (new Date() > expiresAt) {
    throw { status: 400, message: "Nonce expired" };
  }

  if (storedNonce !== nonce) {
    throw { status: 400, message: "Invalid nonce" };
  }

  // 4️⃣ Delete nonce (prevent replay)
  await pool.query(
    "DELETE FROM wallet_nonces WHERE address=$1",
    [normalizedAddress]
  );

  // 5️⃣ Verify signature
  const recoveredAddress = ethers.verifyMessage(nonce, signature.trim());

  if (recoveredAddress.toLowerCase() !== normalizedAddress) {
    throw { status: 400, message: "Invalid signature" };
  }

  // 6️⃣ Check existing wallet
  const existingWallet = await pool.query(
    "SELECT u_id, address FROM wallets WHERE address=$1",
    [normalizedAddress]
  );

  if (existingWallet.rows.length > 0) {
    const linkedUserId = existingWallet.rows[0].u_id;

    if (String(linkedUserId) !== String(u_id)) {
      throw {
        status: 409,
        message: "This wallet is already linked to another account. Please login with the same Web3Auth account.",
      };
    }

    return {
      message: "Wallet already registered",
      walletAddress,
    };
  }

  // 7️⃣ Insert wallet
  try {
    await pool.query(
      "INSERT INTO wallets (u_id, address) VALUES ($1, $2)",
      [u_id, normalizedAddress]
    );
  } catch (error) {
    if (error?.code === "23503") {
      throw { status: 400, message: "Linked user does not exist in wallets database" };
    }
    throw error;
  }

  // 8️⃣ Issue internal JWT
  const token = jwt.sign(
    { u_id, walletAddress: normalizedAddress },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    message: "Wallet registered successfully",
    walletAddress: normalizedAddress,
    token,
  };
};
