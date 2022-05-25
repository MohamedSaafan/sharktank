const { Pool } = require("pg");

const startGames = () => {
  const hourInMilliseconds = 3.6e6;
  setInterval(() => {
      const eventsQuery = await Pool.query(`SELET id , schecdule_date FROM events WHERE schedule_date `)
  }, hourInMilliseconds);
};
