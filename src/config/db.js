console.log("\n\n", process.env.DATABASE_URL, "\n\nfrom database url \n\n");

module.exports = process.env.DATABASE_URL
  ? require("./db_production")
  : require("./db_local");
