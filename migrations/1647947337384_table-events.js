/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
   CREATE TABLE  events(
       id SERIAL PRIMARY KEY,
       team_a INTEGER,
       team_b INTEGER,
       schedule_date TIMESTAMP,
       is_scheduled BOOLEAN DEFAULT false,
      duration INTERVAL DEFAULT '7 00:00:00',
      finished BOOLEAN DEFAULT false
   );
    `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE events`);
};
