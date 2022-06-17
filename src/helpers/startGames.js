const pool = require("../config/db");
const { fork } = require("child_process");

const startGamge = async (eventID) => {
  const childProcess = fork("./src/game/index.js");
  childProcess.send({ eventID });
  childProcess.on("message", (data) => {
    if (data.type === "sendSSEMessage") {
      process.send({
        type: "sendSSEMessage",
        message: data.message,
      });
    }
  });
  process.send({ type: "activeGames", id: eventID });
  const setEventStartedQuery = await pool.query(
    `UPDATE events SET started = true WHERE id = $1`,
    [eventID]
  );

  console.log("event number: " + eventID + " Started Successfully");
};

const startGames = async () => {
  console.log("from start games");
  const minuteInMilliSeconds = 60000;
  console.log("start games running successfully");
  setInterval(async () => {
    console.log("from checking games");
    const eventsQuery = await pool.query(
      `SELECT id FROM events WHERE schedule_date  + duration > now() and started = false and finished = false and is_scheduled = true;`
    );

    for (let i = 0; i < eventsQuery.rows.length; i++) {
      await startGamge(eventsQuery.rows[i].id);
    }
  }, minuteInMilliSeconds / 2);
};
startGames();
