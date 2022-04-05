const { sseReqArray } = require("../routes/sse");

const sendMessage = (res, message) => {
  res.write(`data: ${message}\n\n`);
};
const sendMessageForClients = (message) => {
  sseReqArray.forEach((res) => {
    sendMessage(res, message);
    console.log("\n\n message sent successfylly \n\n");
  });
};

module.exports = { sendMessage, sendMessageForClients };
