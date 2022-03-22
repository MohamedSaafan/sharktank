/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE results (
        collection VARCHAR primary key,
        number_of_play INTEGER DEFAULT 0,
        number_of_participants INTEGER DEFAULT 0,
        number_of_pulled INTEGER DEFAULT 0,
        number_of_eaten INTEGER DEFAULT 0,
        points INTEGER DEFAULT 0
    
    ) 
    `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE results;`);
};
