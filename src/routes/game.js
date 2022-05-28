const pool = require("../config/db_production");
const { fork } = require("child_process");
const { sendMessageForClients } = require("../SSE");
const { activeGames } = require("../shared/state");
const Router = require("express").Router;
const router = new Router();

const hitStartGame = async (eventID) => {
  let isActive = false;
  for (let i = 0; i < activeGames.length; i++) {
    if (+activeGames[i] === +eventID) isActive = true;
  }

  if (isActive) return { wasActive: true };
  // create a child process and make the game excutes in it
  const childProcess = fork("./src/game/index.js");
  childProcess.send({ eventID });
  childProcess.on("message", (data) => {
    if (data.type === "sendSSEMessage") {
      return sendMessageForClients(data.message);
    }
  });

  activeGames.push(+eventID);
};

router.get("/start/:eventID", (req, res, next) => {
  const eventID = req.params.eventID;
  if (!eventID || typeof +eventID !== "number")
    return res.status(400).send({ message: "You Should Provide a game ID" });
  try {
    const gameDetails = hitStartGame(eventID);
    if (gameDetails.wasActive)
      return res.status(400).send({ message: "Game IS Already Started" });
    res.send({ message: "Game Started Successfully" });
    sendMessageForClients(
      JSON.stringify({
        message: "Game Started Successfully",
        type: "gameStarted",
        eventID,
      })
    );
  } catch (err) {
    console.log(err, "error occured");
    res.status(500).send({ message: "Couldn't start the server Successfully" });
  }
});

router.get("/reset", async (req, res, next) => {
  await pool.query(
    `update creatures set is_dead = false, is_picked = false, points = 0`
  );
  await pool.query(
    `UPDATE events set finished = false , started = false where schedule_date + duration < now()`
  );

  res.status(201).send({ message: "creatures reseted successfully" });
});
router.get("/kill", async (req, res) => {
  const killCreaturesQuery = await pool.query(
    `UPDATE creatures SET is_dead = true , is_picked = false`
  );

  res.status(200).send({ message: "Creatures Killed Sucessfully" });
});

let isCheckingGameRunning = false;
router.get("/", async () => {});

module.exports = router;
module.exports.hitStartGame = hitStartGame;
