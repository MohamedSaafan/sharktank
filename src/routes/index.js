const Router = require("express").Router;
const eventRouter = require("./events");

const router = new Router();

router.use(eventRouter);
router.get("/", (req, res, next) => {
  res.send("hello world!");
});
module.exports = router;
