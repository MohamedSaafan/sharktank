const Router = require("express").Router;
const addEventRouter = require("./add-event");
const pool = require("../config/db");
const { sendMessageForClients } = require("../SSE");
const router = new Router();

//middlewares
router.use(addEventRouter);

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
                  CASE WHEN events.duration + events.schedule_date < now() 
                OR events.finished = true   
                THEN 'finished' 
               
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
        object.state = item.state;
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
  // don't forget to return the points of the pulled fish
  res.status(201).send({
    message: "Fish Picked successfully",
    points: +creatureDetails.points,
  });
});

module.exports = router;
