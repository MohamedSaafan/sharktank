const { Router } = require("express");
const pool = require("../config/db");
const router = new Router();

router.get("/:address/online-events", async (req, res, next) => {
  const playerAddress = req.params.address;
  if (!playerAddress)
    return res
      .status(400)
      .send({ message: "Error You Should Provide a user address" });

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
  const joinedEventsQuery = await pool.query(
    `SELECT DISTINCT event_id FROM creatures WHERE address = $1 and joined = true `,
    [playerAddress]
  );
  const joinedEvents = joinedEventsQuery.rows;
  // check the edge case where there are no joined queries
  if (!joinedEventsQuery.rowCount) {
    onlineEvents.map((item) => {
      item.joined = false;
      return item;
    });
    res.status(200).send(onlineEvents);
    return;
  }
  // mark the joined events as joined

  onlineEvents.map((event) => {
    joinedEvents.forEach((joinedEvent) => {
      if (event.event_id === joinedEvent.event_id) return (event.joined = true);
      event.joined = false;
    });
    return event;
  });

  res.status(200).send(onlineEvents);
});

module.exports = router;
