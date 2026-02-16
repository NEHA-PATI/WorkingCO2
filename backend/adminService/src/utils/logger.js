const logger = {
  info: (msg) => console.log(msg),
  warn: (msg) => console.warn(msg),
  error: (msg, err) => console.error(msg, err || "")
};

module.exports = logger;
