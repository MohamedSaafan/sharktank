const pool = require("../config/db.js");

const addCreatures = async (
  eventId,
  address,
  teamID,
  isPicked,
  timePicked,
  isDead
) => {
  try {
    const addQuery = await pool.query(
      `
   INSERT INTO CREATURES (
    event_id,
    address,
    points,
    team_id,
    is_picked,
    time_picked,
    is_dead 
   ) VALUES (
       $1,
       $2,
       0,
       $3,
       $4,
       $5,
       $6
    
   );
   `,
      [eventId, address, teamID, isPicked, timePicked, isDead]
    );
  } catch (err) {
    console.log("error happened while creating creatures", err);
  }
};
const createMultipleCreatures = async (teamID) => {
  for (let i = 0; i < 10000; i++) {
    await addCreatures(
      2,
      "#0029483752fewrq495783fqjwjf--" + i,
      3,
      false,
      null,
      false
    );
  }
  console.log("finished creating creatures");
};
createMultipleCreatures();
module.exports = addCreatures;
