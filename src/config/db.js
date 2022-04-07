console.log("\n\n", process.env.DATABASE_URL, "\n\nfrom database url \n\n");
process.env.DATABASE_URL
  ? console.log("\n\nrequiring db for production\n\n")
  : console.log("\n\n requiring for development \n\n");
module.exports = process.env.DATABASE_URL
  ? require("./db_production")
  : require("./db_local");
