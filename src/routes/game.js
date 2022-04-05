const { startGame } = require("../game");

const Router = require("express").Router;
const router = new Router();

router.get("/start/:eventID", (req, res, next) => {
  const eventID = req.params.eventID;
  startGame(eventID);
  res.send({ message: "Game Started Successfully" });
});

module.exports = router;
