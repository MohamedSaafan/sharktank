const pool = require("../config/db.js");

const addCreatures = async () => {
  const addQuery = await pool.query(`
   INSERT INTO CREATURES (

   ) VALUES (

   )
   `);
};
