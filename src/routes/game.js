const pool = require("../config/db_production");
const { startGame } = require("../game");

const Router = require("express").Router;
const router = new Router();

router.get("/start/:eventID", (req, res, next) => {
  const eventID = req.params.eventID;
  startGame(eventID);
  res.send({ message: "Game Started Successfully" });
});
router.get('/reset',(req,res,next) => {
  await pool.query(`update creatures set is_dead = false, is_picked = false`);
  res.status(201).send({"message":"creatures reseted successfully"});
})

module.exports = router;
