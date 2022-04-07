const Pool = require("pg").Pool;
const DATABASE_URI = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: DATABASE_URI,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
