const pool = require("../config/db");

const Router = require("express").Router;

const router = new Router();

router.get("/teams", (req, res, next) => {
  res.send("teams");
});
router.get("/teams/:id/:eventID", async (req, res, next) => {
  const teamID = req.params.id;
  const eventID = req.params.eventID;
  const teamQuery = await pool.query(
    `
  SELECT  teams.id as "id",
    teams.name as "name",
    sum(creatures.points) as "points"
    FROM events 
    JOIN teams ON team_a = teams.id OR team_b = teams.id 
    JOIN creatures ON creatures.event_id = events.id AND creatures.team_id = teams.id
    GROUP BY events.id , teams.id
	having events.id = $1 and teams.id = $2;
  `,
    [eventID, teamID]
  );
  const eatenCreatures = await pool.query(`
  SELECT id FROM creatures where id =1 and event_id = 1  and is_dead = true;
  `);
  if (!eatenCreatures.rows) {
    const team = teamQuery.rows[0] || {};
    team.eaten_creatures = [];
    return res.send(team);
  }
  const eatenCreaturesArray = eatenCreatures.rows.map((item) => item.id);

  const team = teamQuery.rows[0] || {};
  team.eaten_creatures = eatenCreaturesArray;
  res.send(team);
});
module.exports = router;
