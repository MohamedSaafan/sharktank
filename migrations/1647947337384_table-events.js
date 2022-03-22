/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
   CREATE TABLE  events(
       team_a VARCHAR,
       team_b VARCHAR,
       start_date TIMESTAMP,
   )
    `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE events`);
};
