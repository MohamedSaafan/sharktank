/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`CREATE TABLE creatures (
          id SERIAL PRIMARY KEY,
          event_id integer,
          address VARCHAR,
          points INTEGER,
          team_id INTEGER,
          is_picked BOOLEAN DEFAULT FALSE , 
          time_picked TIMESTAMP, 
          is_dead BOOLEAN DEFAULT FALSE
          );`);
};
exports.down = (pgm) => {
  pgm.sql(`DROP TABLE creatures;`);
};
