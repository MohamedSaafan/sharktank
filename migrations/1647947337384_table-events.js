/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
   CREATE TABLE  events(
       id SERIAL PRIMARY KEY,
       team_a INTEGER,
       team_b INTEGER,
       schedule_date TIMESTAMP,
       is_scheduled BOOLEAN DEFAULT true,
      duration INTERVAL,
      finished BOOLEAN 
   );
    `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE events`);
};
