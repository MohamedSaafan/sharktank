/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
        CREATE TABLE teams(
            id SERIAL PRIMARY KEY,
            name VARCHAR

        ) 
    `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE collections;`);
};
