const router = new require("express").Router();
const sseReqArray = [];

router.get("/monitor", (req, res, next) => {
  res.setHeader("Content-Type", "text/event-stream");
  sseReqArray.push(res);
});

module.exports = {
  router,
  sseReqArray,
};
