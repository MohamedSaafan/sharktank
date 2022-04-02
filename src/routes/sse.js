const router = new require("express").Router();
const sseReqArray = [];

router.get("/monitor", (req, res, next) => {
  sseReqArray.push(req);
});

module.exports = {
  router,
  sseReqArray,
};
