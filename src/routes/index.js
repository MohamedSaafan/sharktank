const Router = require("express").Router;
const eventRouter = require("./events");
const teamsRouter = require("./teams");
const sseRouter = require("./sse").router;
const gameRouter = require("./game");
const playersRouter = require("./players");
const express = require("express");
const router = new Router();
router.use(express.json());
router.use(eventRouter);
router.use(teamsRouter);
router.use(sseRouter);
router.use("/players", playersRouter);
router.use("/game", gameRouter);
router.get("/", (req, res, next) => {
  res.send("hello world!");
});
module.exports = router;
