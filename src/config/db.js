const {
  localDataBaseConnectionString,
  DB_PASSWORD,
  DB_NAME,
  DB_USER,
} = require("../../passwords");
const Pool = require("pg").Pool;

localDataBaseConnectionString;

const pool = new Pool({
  host: "localhost",
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  max: 20,
  port: 5432,
});

module.exports = pool;
