/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
   CREATE TABLE  events(
       id SERIAL PRIMARY KEY,
       team_a VARCHAR,
       team_b VARCHAR,
       schedule_date TIMESTAMP,
       is_scheduled BOOLEAN
   );
    `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE events`);
};
