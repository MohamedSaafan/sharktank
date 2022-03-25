/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
        CREATE TABLE collections(
            id SERIAL PRIMARY ID,
            name VARCHAR

        ) 
    `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE collections;`);
};
