/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`CREATE TABLE creatures (
          id SERIAL PRIMARY KEY,
          event_id integer,
          address VARCHAR,
          points INTEGER,
          team_id INTEGER,
          times_picked timestamp,
          is_picked BOOLEAN, 
          time_picked TIMESTAMP, 
          is_dead BOOLEAN,
          collection_id integer
          );`);
};
exports.down = (pgm) => {
  pgm.sql(`DROP TABLE creatures;`);
};
