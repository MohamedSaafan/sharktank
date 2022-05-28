const router = new require("express").Router();
const { sseReqArray } = require("../shared/state.js");

router.get("/monitor", (req, res, next) => {
  res.setHeader("Content-Type", "text/event-stream");
  console.log(sseReqArray.length, "from sse Req Array length");
  const message = JSON.stringify({
    type: "connection",
    message: "Connection Accepted!",
  });
  res.write(`data: ${message}\n\n`);
  sseReqArray.push(res);
  // const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  // sseReqArray.filter((req) => {
  //   const currReqIp =
  //     req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  //   return currReqIp !== ip;
  // });
});

module.exports = {
  router,
  sseReqArray,
};
