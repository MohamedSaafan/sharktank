// module.exports = process.env.DATABASE_URL
//   ? require("./db_production")
//   : require("./db_local")
const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString:
    "postgres://vffzebqpumjwus:9d962ff5f97d66555c548ff4061985c5695224824da1e7712dcaed757ea6e07f@ec2-54-172-175-251.compute-1.amazonaws.com:5432/d6hta5cbl6s0fq",
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
