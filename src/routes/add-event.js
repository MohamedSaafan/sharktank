const router = new require("express").Router();
const pool = require("../config/db");

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
// insert event end point
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
