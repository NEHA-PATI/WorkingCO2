const { ethers } = require("ethers");

async function run() {
  const privateKey = "0x8f195b46aaf1c0b91e27e36988f3cb2e2757b9f484947e9052440e37fd4330ed";

  const wallet = new ethers.Wallet(privateKey);

  const nonce = "54f0f53e4cfc5bc382da7c99bc6a9db42156279ffb520c6b3f3c038fdc2f69e4";

  const signature = await wallet.signMessage(nonce);

  console.log("Address:", wallet.address);
  console.log("Nonce:", nonce);
  console.log("Signature:", signature);
}

run();