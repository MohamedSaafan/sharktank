const pool = require("../config/db_production");
const { fork } = require("child_process");

const Router = require("express").Router;
const router = new Router();

const activeGames = [];

router.get("/start/:eventID", (req, res, next) => {
  const eventID = req.params.eventID;
  if (!eventID || typeof +eventID !== "number")
    return res.status(400).send({ message: "You Should Provide a game ID" });

  let isActive = false;
  for (let i = 0; i < activeGames.length; i++) {
    if (activeGames[i] === +eventID) isActive = true;
  }
  if (isActive)
    return res.status(403).send({ message: "Game is Already Started" });
  // create a child process and make the game excutes in it
  try {
    const childProcess = fork("./src/game/index.js");
    childProcess.send({ eventID });

    activeGames.push(+eventID);
    res.send({ message: "Game Started Successfully" });
  } catch (err) {
    console.log(err, "error occured");
    res.status(500).send({ message: "Couldn't start the server Successfully" });
  }
});

router.get("/reset", async (req, res, next) => {
  await pool.query(`update creatures set is_dead = false, is_picked = false`);
  res.status(201).send({ message: "creatures reseted successfully" });
});

module.exports = router;
