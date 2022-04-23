const { Router } = require("express");
const pool = require("../config/db");
const router = new Router();

router.get("/players/:address/online-events", async (req, res, next) => {
  const playerAddress = req.params.address;
  // we need to get all the events the player has a creature in
  const eventsQuery = await pool.query(
    `SELECT DISTINCT event_id
     FROM creatures JOIN events ON creatures.event_id = events.id
     where address = $1 
     AND 
     events.schedule_date <= now() 
     AND events.finished = false
     AND events.is_scheduled = true;
     `,
    [playerAddress]
  );
  if (eventsQuery.rowCount === 0) return res.send([]);
  const eventsIDsArray = eventsQuery.rows.map((row) => row.event_id);
  res.send(eventsIDsArray);
  [{ event_id, team_id }];
});

module.exports = router;
