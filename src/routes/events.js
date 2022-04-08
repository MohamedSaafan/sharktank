const Router = require("express").Router;
const pool = require("../config/db");
const router = new Router();

const getEvents = async () => {
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

    events.forEach((item) => {
      if (eventItem.eventId === item.id) {
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
          object.id = item.eventId;
          object.schedule_date = item.scheduledDate;
          object.end_date = new Date(item.end_date).getTime();
        }
      }
    });

    return object;
  });
  return mappedEvents;
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
router.get("/events/:id/:teamId/creatures", async (req, res, next) => {
  const eventID = req.params.id;
  const teamID = req.params.teamId;
  const creaturesQuery = await pool.query(
    `select address, points, is_picked , is_dead,id from creatures where team_id = $1 and event_id = $2;`,
    [teamID, eventID]
  );

  res.send({ creatures: creaturesQuery.rows });
});
module.exports = router;
