/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`CREATE TABLE creature (
        id SERIAL PRIMARY KEY,
        address VARCHAR,
        points INTEGER,
        team_id INTEGER,
        is_picked BOOLEAN, 
        time_picked TIMESTAMP, 
        is_eaten BOOLEAN
        );`);
};
exports.down = (pgm) => {
  pgm.sql(`DROP TABLE fishes;`);
};
