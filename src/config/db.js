module.exports = process.env.DATABASE_URL
  ? require("./db_production")
  : require("./db_local");
