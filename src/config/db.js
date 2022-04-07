module.exports = process.env.DATABASE_URI
  ? require("./db_production")
  : require("./db_local");
