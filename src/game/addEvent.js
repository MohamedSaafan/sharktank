const pool = require("../config/db.js");

const createEvent = async (
  teamA,
  teamB,
  scheduleDate,
  isScheduled,
  duration,
  finished
) => {
  try {
    const createEventQuery = await pool.query(
      `
            INSERT INTO events (
                team_a,
                team_b,
                schedule_date,
                is_scheduled,
                duration,
                finished
            ) VALUES (
                $1,$2,$3,$4,$5,$6
        
            )
            
            `,
      [teamA, teamB, scheduleDate, isScheduled, duration, finished]
    );
  } catch (err) {
    console.log("some Error Happened", err);
  }
};
createEvent(1, 3, "now()", true, "5 00:00:00", false);

module.exports = createEvent;
