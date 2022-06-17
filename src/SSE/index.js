const { sseReqArray } = require("../shared/state");

const sendMessage = (res, message) => {
  try {
    res.write(`data: ${message}\n\n`);
  } catch (err) {
    console.log("\n\nsome error happened while writing the message\n\n");
    console.log(err);
  }
};
const sendMessageForClients = (message) => {
  console.log(
    "about to send a message from setting message",
    sseReqArray.length
  );

  sseReqArray.forEach((res) => {
    console.log("from for each");
    sendMessage(res, message);
    console.log("\n\n message sent successfylly \n\n", message);
    console.log("\n\n\n");
  });
};
// let i = 0;
// setInterval(() => {
//   const message = JSON.stringify({
//     message: "message number " + i++ + "  sent",
//   });
//   sendMessageForClients(message);
// }, 5000);

module.exports = { sendMessage, sendMessageForClients };
