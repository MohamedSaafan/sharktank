const pool = require("../config/db");
const { sseReqArray } = require("../routes/sse.js");
const { sendMessageForClients } = require("../SSE/index");

const getTwoTeams = async (event_id) => {
  const getTeamsQuery = await pool.query(
    `SELECT team_a,team_b FROM events WHERE id = $1`,
    [event_id]
  );
  const teamAID = getTeamsQuery.rows[0].team_a;
  const teamBID = getTeamsQuery.rows[0].team_b;
  return { teamAID, teamBID };
};

const getUnKilledCreatures = async (teamID, eventID) => {
  const selectUnKilledQuery = await pool.query(
    ` select id from creatures where team_id = $1 and  event_id = $2 and is_dead = false;`,
    [teamID, eventID]
  );
  return selectUnKilledQuery.rows.map((row) => row.id);
};

const pickRandomCreature = (liveCreaturesIDs) => {
  const selectedCreaturesIndeces = [];
  // pick random 10 creatures and kill them
  while (true) {
    if (selectedCreaturesIndeces.length >= 10) break;
    const randomIndex = Math.floor(Math.random() * liveCreaturesIDs.length);
    const isExistInRandomIndex =
      selectedCreaturesIndeces.indexOf(randomIndex) !== -1 ? true : false;
    if (isExistInRandomIndex) continue;
    selectedCreaturesIndeces.push(randomIndex);
  }
  return selectedCreaturesIndeces;
};
const killCreatures = async (eventID, teamID) => {
  const liveCreaturesIDs = await getUnKilledCreatures(teamID, eventID);
  if (liveCreaturesIDs.length < 10) {
    if (liveCreaturesIDs.length === 0) {
      return [];
    }
    // kill all of them
    console.log(
      liveCreaturesIDs,
      "from live creatures ids\n",
      liveCreaturesIDs.toString()
    );
    const killCreaturesQuery = await pool.query(
      `UPDATE CREATURES SET is_dead = true where id IN (${liveCreaturesIDs.join()})`
    );
    return liveCreaturesIDs;
  }

  const selectedCreaturesIndeces = pickRandomCreature(liveCreaturesIDs);
  // now we need to retreive the ids in their own array
  const selectedCreaturesIDs = selectedCreaturesIndeces.map(
    (item) => liveCreaturesIDs[item]
  );
  // kill the creatures
  const desiredCreaturesIDsString = selectedCreaturesIDs.toString();
  const killCreaturesQuery = await pool.query(
    `UPDATE CREATURES SET is_dead = true WHERE id IN (${desiredCreaturesIDsString})`
  );
  return desiredCreaturesIDsString.split(",");
};

const rewardCreatures = async (eventID) => {
  await pool.query(
    `UPDATE creatures set points = points + 1 WHERE is_dead = false AND event_id = $1`,
    [eventID]
  );
};

const getCreaturesPoints = async (creaturesArray, eventID) => {
  const query = await pool.query(
    `
    SELECT SUM(points) as sum_of_points FROM creatures
    WHERE id IN (${creaturesArray.join()}) and event_id = $1
    `,
    [eventID]
  );
  return query.rows[0].sum_of_points;
};
const getTeamPoints = async (teamID, eventID) => {
  const query = await pool.query(
    ` SELECT SUM(points) as sum_of_points FROM creatures
  WHERE team_id = $1 and  event_id = $2;`,
    [teamID, eventID]
  );
  return query.rows.sum_of_points;
};

const startGame = async (eventID) => {
  const { teamAID, teamBID } = await getTwoTeams(eventID);
  /// run eat creatures function every 1 hour
  console.log(eventID, teamAID, teamBID, "from event and team ids");
  const killCreatureIntervalKey = setInterval(async () => {
    const teamAkilledCreaturesIDs = await killCreatures(eventID, teamAID);

    const teamBKilledCreaturesIDs = await killCreatures(eventID, teamBID);
    console.log(teamBKilledCreaturesIDs, "from killed creatures ids");

    const teamAPoints = await getTeamPoints(teamAID, eventID);
    const teamBPoints = await getTeamPoints(teamBID, eventID);
    const killMessage = JSON.stringify({
      [teamAID]: {
        killed_creatures: teamAkilledCreaturesIDs,
        new_points: +teamAPoints,
      },
      [teamBID]: {
        killed_creatures: teamBKilledCreaturesIDs,
        new_points: +teamBPoints,
      },
      event_id: eventID,
    });
    console.log(killMessage, "from killed Message ");
    sendMessageForClients(killMessage);

    await rewardCreatures(eventID);
  }, 45000);

  //3 600 000 milli seconds equals one hour
  // run reward creatures every hour after the eat creatures passed
};
killCreatures(1, 2);
module.exports = {
  startGame,
};
