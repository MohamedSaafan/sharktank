const pool = require("../config/db");
const addTeam = async (name) => {
  try {
    const addTeamQuery = await pool.query(
      `
            INSERT INTO TEAMS (
                name
            ) VALUES (
                $1
            )
            
            `,
      [name]
    );
  } catch (err) {
    console.log("error when creating a team", err);
  }
};
module.exports = addTeam;
