const router = new require("express").Router();
let { sseReqArray } = require("../shared/state.js");
const uuid = require("uuid").v4;

router.get("/monitor", (req, res, next) => {
  res.setHeader("Content-Type", "text/event-stream");
  const message = JSON.stringify({
    type: "connection",
    message: "Connection Accepted!",
  });
  const id = uuid();
  res.id = id;
  res.write(`data: ${message}\n\n`);
  // res.socket.on("end", (e) => {
  //   console.log("event Source Closed");
  //   sseReqArray = sseReqArray.filter((x) => x.id != id);
  // });
  sseReqArray.push(res);
});

module.exports = {
  router,
  sseReqArray,
};
