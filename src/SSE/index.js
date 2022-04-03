const sendMessage = (req, message) => {
  req.write(`data: ${message}\n\n`);
};

module.exports = { sendMessage };
