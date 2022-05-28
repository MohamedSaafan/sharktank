const express = require("express");
const router = require("./routes");
const cors = require("cors");
const app = express();
const { fork } = require("child_process");
const childProcess = fork("./src/helpers/startGames.js");
app.use(cors());

app.use("/api/v1", router);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("app runing sucesffully in port 8080");
});
