const Router = require("express").Router;
const eventRouter = require("./events");
const teamsRouter = require("./teams");
const router = new Router();

router.use(eventRouter);
router.use(teamsRouter);
router.get("/", (req, res, next) => {
  res.send("hello world!");
});
module.exports = router;
