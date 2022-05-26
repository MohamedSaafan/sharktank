const { sseReqArray } = require("../routes/sse");

const sendMessage = (res, message) => {
  console.log(res, "from res");
  try {
    res.write(`data: ${message}\n\n`);
  } catch (err) {
    console.log("\n\nsome error happened while writing the message\n\n");
    console.log(err);
  }
};
const sendMessageForClients = (message) => {
  console.log(sseReqArray.length, "from the length of the sse array");
  sseReqArray.forEach((res) => {
    sendMessage(res, message);
    console.log("\n\n message sent successfylly \n\n", message);
  });
};
const sendMessageForPlayerCreatures = (killedCreaturesArray) => {
  sseReqArray.forEach((req) => {
    const address = req.params.address;
    if (address) {
      killedCreaturesArray.map((creature) => {
        if (creature.address == address) {
          return { creatureID: creature.id, creaturePoints: creature.points };
        }
      });
      res.write(`data: ${message}\n\n`);
    }
  });
};

module.exports = { sendMessage, sendMessageForClients };
