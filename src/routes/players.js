const { Router } = require("express");
const pool = require("../config/db");
const router = new Router();

router.get("/:address/online-events", async (req, res, next) => {
  const playerAddress = req.params.address;
  // we need to get all the events the player has a creature in
  const eventsQuery = await pool.query(
    `SELECT DISTINCT event_id,creatures.team_id
    FROM creatures JOIN events ON creatures.event_id = events.id
    where address = $1
    AND 
    events.schedule_date <= now() 
    AND events.finished = false
    OR events.finished = null
    AND events.is_scheduled = true;
     `,
    [playerAddress]
  );
  const onlineEvents = eventsQuery.rows;

  // after getting the creatures we need to see the IDs of the events he joined in mark them as joined

  res.send(eventsQuery.rows);
});

module.exports = router;
