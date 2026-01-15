const generateUID = (prefix, id) => {
  return `${prefix}${id.toString().padStart(4, "0")}`;
};
module.exports = generateUID;
