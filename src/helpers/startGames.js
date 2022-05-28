const pool = require("../config/db");
const { fork } = require("child_process");

const startGamge = async (eventID) => {
  const childProcess = fork("./src/game/index.js");
  childProcess.send({ eventID });
  childProcess.on("message", (data) => {
    if (data.type === "sendSSEMessage") {
      console.log(
        "about to forward a message to the root process from start Games"
      );

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
  const minuteInMilliSeconds = 60000;

  setInterval(async () => {
    console.log("from checking the games");
    const eventsQuery = await pool.query(
      `SELECT id FROM events WHERE schedule_date  + duration > now() and started = false and finished = false`
    );

    console.log(eventsQuery.rowCount, "from length of the active games");

    for (let i = 0; i < eventsQuery.rows.length; i++) {
      console.log("events number", eventsQuery.rows[i].id);
      await startGamge(eventsQuery.rows[i].id);
    }
  }, minuteInMilliSeconds / 2);
};
startGames();
