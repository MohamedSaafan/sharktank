const express = require("express");
const router = require("./routes");

const app = express();

app.use("/api/v1", router);

app.listen(8080, () => {
  console.log("app runing sucesffully in port 8080");
});
