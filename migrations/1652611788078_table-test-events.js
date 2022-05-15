/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`CREATE TABLE test_events (
        id SERIAL PRIMARY KEY,
        address VARCHAR ,
        event_id INTEGER
    )`);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE test_events;`);
};
