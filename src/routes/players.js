const { Router } = require("express");
const { append } = require("express/lib/response");
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
    `SELECT DISTINCT event_id,creatures.team_id,teams.name as "team_name"
    FROM creatures JOIN events ON creatures.event_id = events.id JOIN teams on creatures.team_id = teams.id
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
  console.log(onlineEvents.rows, "from online events");
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

router.post("/:address/:eventID/:teamID", async (req, res, next) => {
  // handle the join event
  const { address, eventID, teamID } = req.params;
  console.log(address, eventID, teamID, "from address, eventid , team id");
  if (!address || !eventID || !teamID)
    return res.status(400).send({ message: "Invalid Input Error" });

  const joinQuery = await pool.query(
    `UPDATE creatures SET joined = true WHERE address = $1 AND event_id = $2 AND team_id = $3`,
    [address, eventID, teamID]
  );
  res.status(204).send({ message: "User Joined Successfully" });
});
router.get("/registered/:address", async (req, res, next) => {
  const address = req.params.address;
  if (!address) {
    return res.status(400).send({ message: "You should provide your address" });
  }
  const fetchRegisteredQuery = await pool.query(
    `SELECT count(*) as "numOfRegestered" from test_events`
  );
  const numberOfRegistered = fetchRegisteredQuery.rows[0].numOfRegestered;

  const checkRegisteredQuery = await pool.query(
    "SELECT * FROM test_events where address = $1",
    [address]
  );
  let isRegistered = true;
  if (!checkRegisteredQuery.rowCount) isRegistered = false;
  res.status(200).send({
    numberOfRegistered,
    isRegistered,
  });
});
router.post("/register", async (req, res, next) => {
  console.log(req.body);
  const address = req.body.address;
  if (!address) {
    return res.status(400).send({ message: "No Address is Provided" });
  }
  const findAddressQuery = await pool.query(
    `SELECT * FROM test_events where address = $1`,
    [address]
  );

  if (findAddressQuery.rowCount) {
    return res.status(400).send({ message: "User Already Registered" });
  }
  const insertUserQuery = await pool.query(
    `INSERT INTO test_events (address,event_id) VALUES ($1,1)`,
    [address]
  );
  for (let i = 0; i < 9; i++) {
    await pool.query(
      `insert into creatures (event_id,address,points,team_id,is_picked,is_dead,joined) VALUES(1,$1,0,2,false,false,false)`,
      [address]
    );
  }
  res.status(201).send({ message: "User Registered Successfully" });
  // check if there is provided address
  // check if the address is registered
  // register the address
});
router.post("/unregister", async (req, res) => {
  const address = req.body.address;
  const unRegisterQuery = await pool.query(
    `delete from test_events where address = $1`,
    [address]
  );
  res.status(200).send({ message: "Unregistered successfully" });
});

module.exports = router;
