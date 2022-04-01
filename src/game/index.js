const pool = require("../config/db");

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
    const randomIndex = Math.floor(Math.random() * liveCreaturesIDs);
    const isExistInRandomIndex =
      selectedCreaturesIndeces.indexOf(randomIndex) !== -1 ? true : false;
    if (isExistInRandomIndex) continue;
    selectedCreaturesIndeces.push(randomIndex);
  }
  return selectedCreaturesIndeces;
};

const killCreatures = async (eventID, teamID) => {
  const liveCreaturesIDs = getUnKilledCreatures(teamID, eventID);
  if (liveCreaturesIDs.length < 10) {
    // kill all of them
    const killCreaturesQuery = await pool.query(
      `UPDATE CREATURES SET is_dead = true where id IN (${liveCreaturesIDs.toString()})`
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
    `UPDATE CREATURES SET is_dead = true WHERE id IN ${desiredCreaturesIDsString}`
  );
  return desiredCreaturesIDsString;
};
const rewardCreatures = async (eventID) => {
  await pool.query(
    `UPDATE creatures set points = points + 1 WHERE is_killed = false AND event_id = $1`,
    eventID
  );
};

const startGame = (eventID) => {
  const { teamAID, teamBID } = getTwoTeams(eventID);
  /// run eat creatures function every 1 hour
  const killCreatureIntervalKey = setInterval(async () => {
    await killCreatures(eventID, teamAID);
    await killCreatures(eventID, teamBID);
    await rewardCreatures(eventID);
  }, 60000);
  //3 600 000 milli seconds equals one hour

  // run reward creatures every hour after the eat creatures passed
};
