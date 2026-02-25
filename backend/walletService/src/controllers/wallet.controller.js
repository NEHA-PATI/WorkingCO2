const walletService = require("../services/wallet.service");

exports.getNonce = async (req, res, next) => {
  try {
    const { address } = req.query;

    const nonce = await walletService.generateNonce(address);

    res.json({ nonce });
  } catch (error) {
    next(error);
  }
};

exports.registerWallet = async (req, res, next) => {
  try {
    const result = await walletService.registerWallet(req.body);

    res.json(result);
  } catch (error) {
    next(error);
  }
};