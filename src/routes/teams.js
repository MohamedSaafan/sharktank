const Router = require("express").Router;

const router = new Router();

router.get("/teams/:id/eventID", async (req, res, next) => {
  res.send(req.params.id);
});
module.exports = router;
