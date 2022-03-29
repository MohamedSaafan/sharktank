const Router = require("express").Router;
const pool = require("../config/db");
const router = new Router();

router.get("/api/v1/events/", async (req, res, next) => {
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
         END as "state"
    FROM events 
    JOIN teams ON team_a = teams.id OR team_b = teams.id 
    JOIN creatures ON creatures.event_id = events.id AND creatures.team_id = teams.id
    GROUP BY events.id , teams.id;  
     `
  );
  console.log(
    new Date(teamsQuery.rows[0].schedule_date).getTime(),
    "from date"
  );
  const events = teamsQuery.rows.map((row) => {
    console.log(row, "from row");
    row.scheduledDate = new Date(row.scheduleDate).getTime();
    return row;
  });

  const eventsListQuery = await pool.query(`SELECT * FROM events`);
  const eventsList = eventsListQuery.rows;
  const mappedEvents = eventsList.map((eventItem) => {
    const object = {};

    events.forEach((item) => {
      console.log(eventItem, item, "from item and event item");
      if (eventItem.eventId === item.id) {
        if (object.team_a) {
          object.team_b = {
            id: item.teamId,
            name: item.teamName,
            points: item.points,
          };
        } else {
          object.team_a = {
            id: item.teamId,
            name: item.teamName,
            points: item.points,
          };
          object.id = item.eventId;
          object.date = item.scheduledDate;
        }
      }
    });
    console.log(new Date(object.date - new Date()), "from different time");
    return object;
  });

  res.send(mappedEvents);
});

module.exports = router;
