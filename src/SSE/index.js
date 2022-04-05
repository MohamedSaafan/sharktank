const { sseReqArray } = require("../routes/sse");

const sendMessage = (req, message) => {
  req.write(`data: ${message}\n\n`);
};
const sendMessageForClients = (message) => {
  sseReqArray.forEach((req) => {
    send(req, message);
  });
};

module.exports = { sendMessage, sendMessageForClients };
