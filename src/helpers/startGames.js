const { Pool } = require("pg");
const { activeGames } = require("../shared/state");
const pool = require("../config/db");
const { hitStartGame } = require("../routes/game.js");
const startGames = async () => {
  const minuteInMilliSeconds = 60000;
  setInterval(async () => {
    console.log("from checking the games");
    const eventsQuery = await pool.query(
      `SELECT id, schedule_date FROM events WHERE schedule_date < now() and started = false and finished = false `
    );

    eventsQuery.rows.map(async (event) => {
      hitStartGame(event.id);
      activeGames.push(event.id);
      const setEventStartedQuery = await pool.query(
        `UPDATE events SET started = true WHERE id = $1`,
        [event.id]
      );
      console.log("event number: " + event.id + " Started Successfully");
    });
  }, minuteInMilliSeconds);
};
startGames();
