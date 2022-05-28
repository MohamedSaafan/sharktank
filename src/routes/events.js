const Router = require("express").Router;
const { append } = require("express/lib/response");
const res = require("express/lib/response");
const pool = require("../config/db");
const { sendMessage, sendMessageForClients } = require("../SSE");
const router = new Router();
const getTeamPoints = async (teamID, eventID) => {
  const teamAPoints = await pool.query(
    `
    select sum(points) as points from creatures where team_id = $1 and event_id = $2 and  is_dead = false
   `,
    [teamID, eventID]
  );
  if (!teamAPoints.rowCount) return 0;
  return +teamAPoints.rows[0].points;
};
const getEvents = async () => {
  // the logic of points here isn't valid
  const teamsQuery = await pool.query(
    `SELECT events.id as "eventId" ,
    events.is_scheduled as "isScheduled",
    events.schedule_date as "scheduleDate" ,
    teams.name as "teamName",
    teams.name, teams.id as "teamId",
    sum(creatures.points) as "points",
    CASE  
      WHEN events.is_scheduled = false THEN 'notScheduled'
      WHEN events.is_scheduled is null THEN 'notScheduled' 
      WHEN events.is_scheduled = true THEN 
        CASE 
          WHEN events.duration + events.schedule_date < now() + events.duration   
                OR 
                events.duration + events.schedule_date = now() + events.duration THEN 
                  CASE WHEN events.duration + events.schedule_date < now() THEN 'finished' 
                  ELSE 'live' END
          WHEN events.duration + events.schedule_date > now() + events.duration AND events.is_scheduled = true THEN 'scheduled' END
      END as "state",
    (events.schedule_date + events.duration) as "end_date"
    FROM events 
    JOIN teams ON team_a = teams.id OR team_b = teams.id 
    JOIN creatures ON creatures.event_id = events.id AND creatures.team_id = teams.id
    GROUP BY events.id , teams.id;  
     `
  );

  const events = teamsQuery.rows.map((row) => {
    row.scheduledDate = new Date(row.scheduleDate).getTime();
    return row;
  });

  const eventsListQuery = await pool.query(`SELECT * FROM events`);
  const eventsList = eventsListQuery.rows;

  const mappedEvents = eventsList.map((eventItem) => {
    const object = {};
    events.forEach(async (item) => {
      if (eventItem.id === item.eventId) {
        eventItem.finished
          ? (object.state = "finished")
          : (object.state = item.state);
        if (object.team_a) {
          object.team_b = {
            id: item.teamId,
            name: item.teamName,
            points: +item.points,
          };
        } else {
          object.team_a = {
            id: item.teamId,
            name: item.teamName,
            points: +item.points,
          };

          object.schedule_date = item.scheduledDate;
          object.id = eventItem.id;
          object.end_date = new Date(item.end_date).getTime();
        }
      }
    });

    return object;
  });
  const eventsWithPoints = await Promise.all(
    mappedEvents.map(async (event) => {
      const teamAPoints = await getTeamPoints(event.team_a.id, event.id);
      const teamBPoints = await getTeamPoints(event.team_b.id, event.id);
      event.team_a.points = teamAPoints;
      event.team_b.points = teamBPoints;
      return event;
    })
  );

  return eventsWithPoints;
};

router.get("/events/", async (req, res, next) => {
  const events = await getEvents();
  res.send(events);
});

router.get("/events/:id", async (req, res, next) => {
  const events = await getEvents();
  const filteredEvents = events.filter((event) => {
    return event.id === +req.params.id;
  });
  console.log(filteredEvents, "from events");
  res.send(filteredEvents[0]);
});
router.get("/events/:id/:teamId/:address/creatures", async (req, res, next) => {
  const eventID = req.params.id;
  const teamID = req.params.teamId;
  const address = req.params.address;
  const creaturesQuery = await pool.query(
    `select address, points, is_picked , is_dead,id from creatures where team_id = $1 and event_id = $2 and address = $3`,
    [teamID, eventID, address]
  );

  res.send({ creatures: creaturesQuery.rows });
});
router.post("/events/:id/pull/:creature_id", async (req, res, next) => {
  const eventID = req.params.id;
  const creatureID = req.params.creature_id;
  // check if the creature is already eaten or not
  const checkIfLiveQuey = await pool.query(
    `select * from creatures where id = $1 and event_id = $2 and is_dead = false`,
    [creatureID, eventID]
  );
  if (!checkIfLiveQuey.rowCount)
    return res.status(405).send({ message: "Operation Not Permitted Error" });
  const updateCreatureQuery = await pool.query(
    `UPDATE creatures SET is_picked = true where id = $1 and event_id = $2`,
    [creatureID, eventID]
  );

  const creatureDetailsQuery = await pool.query(
    `SELECT team_id , points from creatures where id = $1 and event_id = $2`,
    [creatureID, eventID]
  );
  if (!creatureDetailsQuery.rowCount)
    return res.status(400).send({ message: "No Such Creature Found" });
  const creatureDetails = creatureDetailsQuery.rows[0];
  const SSEMessage = JSON.stringify({
    event_id: eventID,
    team_id: creatureDetails.team_id,
    type: "pulled",
    points: +creatureDetails.points,
  });
  sendMessageForClients(SSEMessage);
  console.log(SSEMessage, "from message ");
  console.log(creatureDetails.points, "from points");
  // don't forget to return the points of the pulled fish
  res.status(201).send({
    message: "Fish Picked successfully",
    points: +creatureDetails.points,
  });
});
const getTeamIDByName = async (teamName) => {
  const getTeamQuery = await pool.query(
    `SELECT id FROM teams where name = $1`,
    [teamName]
  );
  console.log(getTeamQuery.rowCount, "from row count");
  if (!getTeamQuery.rowCount) {
    await pool.query(`INSERT INTO teams (name) values ($1)`, [teamName]);
    const teamIDQuery = await pool.query(
      `SELECT id FROM teams where name = $1`,
      [teamName]
    );

    return teamIDQuery.rows[0].id;
  }
  return getTeamQuery.rows[0].id;
};
router.post("/events", async (req, res, next) => {
  const {
    teamAName,
    teamBName,
    scheduleDate,
    isScheduled,
    duration,
    finished,
  } = req.body;
  const client = await pool.connect();
  try {
    client.query("BEGIN;");
    const teamAID = await getTeamIDByName(teamAName);
    const teamBID = await getTeamIDByName(teamBName);
    console.log(duration, "from durtion");
    await client.query(
      `INSERT INTO events (team_a,team_b,schedule_date,is_scheduled,duration,finished) 
        VALUES (
          $1,$2,$3,$4,$5::INTERVAL,$6
        )
      
      `,
      [
        teamAID,
        teamBID,
        new Date(scheduleDate),
        isScheduled,
        duration,
        finished,
      ]
    );
    const eventIDQuery = await client.query(
      `select id from events WHERE team_a = $1 AND team_b = $2 AND schedule_date = $3 `,
      [teamAID, teamBID, new Date(scheduleDate)]
    );
    const eventID = eventIDQuery.rows[0].id;

    await client.query(
      `INSERT INTO creatures (
      event_id,
      address,
      points,
      team_id,
      is_picked,
      is_dead,
      joined
    ) VALUES (
      $1,
      'address',
      0,
      $2,
      false,
      false,
      false
    )`,
      [eventID, teamAID]
    );
    await client.query(
      `INSERT INTO creatures (
      event_id,
      address,
      points,
      team_id,
      is_picked,
      is_dead,
      joined
    ) VALUES (
      $1,
      'address',
      0,
      $2,
      false,
      false,
      false
    )`,
      [eventID, teamBID]
    );
    await client.query("COMMIT");
    res.status(201).send({ message: "Event Created Successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.log(err, "from error");
    res.status(500).send({ message: "Couldn't Create the Event" });
  } finally {
    client.release();
  }
});
module.exports = router;
