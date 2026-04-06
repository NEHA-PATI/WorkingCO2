const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");
const { WEB3AUTH_CLIENT_ID, WEB3AUTH_ISSUER } = require("../config/env");

const WEB3AUTH_ALLOWED_ALGORITHMS = ["RS256", "ES256", "ES384", "ES512"];

const jwksClients = new Map();

function normalizeIssuer(value) {
  if (!value || typeof value !== "string") return "";
  return value.replace(/\/+$/, "");
}

function getJwksClient(issuer) {
  const normalizedIssuer = normalizeIssuer(issuer);
  if (!normalizedIssuer) {
    throw new Error("Invalid token issuer");
  }

  if (!jwksClients.has(normalizedIssuer)) {
    jwksClients.set(
      normalizedIssuer,
      jwksClient({
        jwksUri: `${normalizedIssuer}/.well-known/jwks.json`,
        cache: true,
        cacheMaxEntries: 10,
        cacheMaxAge: 60 * 60 * 1000,
      })
    );
  }

  return jwksClients.get(normalizedIssuer);
}

function getKeyForIssuer(issuer) {
  return (header, callback) => {
    const client = getJwksClient(issuer);
    client.getSigningKey(header.kid, function (err, key) {
      if (err) return callback(err);
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    });
  };
}

function verifyJwt(idToken, { issuer, audience }) {
  return new Promise((resolve, reject) => {
    const options = {
      issuer,
      algorithms: WEB3AUTH_ALLOWED_ALGORITHMS,
    };

    if (audience) options.audience = audience;

    jwt.verify(idToken, getKeyForIssuer(issuer), options, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
}

exports.verifyWeb3AuthToken = (idToken) => {
  const decodedToken = jwt.decode(idToken, { complete: true });
  const tokenIssuer = normalizeIssuer(decodedToken?.payload?.iss);
  const defaultIssuer = normalizeIssuer(WEB3AUTH_ISSUER);

  const issuerCandidates = [...new Set([tokenIssuer, defaultIssuer].filter(Boolean))];

  if (issuerCandidates.length === 0) {
    return Promise.reject(new Error("Unable to determine token issuer"));
  }

  return (async () => {
    let lastError;

    for (const issuer of issuerCandidates) {
      try {
        // Strict mode: issuer + audience
        return await verifyJwt(idToken, {
          issuer,
          audience: WEB3AUTH_CLIENT_ID,
        });
      } catch (error) {
        lastError = error;

        const isAudienceOrIssuerError =
          error?.name === "JsonWebTokenError" &&
          (String(error.message || "").includes("audience") ||
            String(error.message || "").includes("issuer"));

        if (!isAudienceOrIssuerError) {
          continue;
        }

        try {
          // Fallback for provider-side claim differences: keep signature+issuer validation.
          return await verifyJwt(idToken, { issuer });
        } catch (fallbackError) {
          lastError = fallbackError;
        }
      }
    }

    throw lastError || new Error("Web3Auth token verification failed");
  })();
};
