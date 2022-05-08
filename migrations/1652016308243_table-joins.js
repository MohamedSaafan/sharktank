/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.query(`CREATE TABLE joins (
      ID SERIAL PRIMARY KEY,
      address VARCHAR ,
      joined BOOLEAN DEFAULT false,
      event_id INTEGER,
      team_id INTEGER
  );`);
};

exports.down = (pgm) => {
  pgm.query(`DROP TABLE joins;`);
};
