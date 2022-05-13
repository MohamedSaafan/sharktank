const router = new require("express").Router();
const sseReqArray = [];

router.get("/monitor", (req, res, next) => {
  res.setHeader("Content-Type", "text/event-stream");
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
