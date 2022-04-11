const { sseReqArray } = require("../routes/sse");

const sendMessage = (res, message) => {
  try {
    res.write(`data: ${message}\n\n`);
  } catch (err) {
    console.log("\n\nsome error happened while writing the message\n\n");
    console.log(err);
  }
};
const sendMessageForClients = (message) => {
  sseReqArray.forEach((res) => {
    sendMessage(res, message);
    console.log("\n\n message sent successfylly \n\n");
  });
};

module.exports = { sendMessage, sendMessageForClients };
