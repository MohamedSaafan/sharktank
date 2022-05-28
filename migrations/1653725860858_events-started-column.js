/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`ALTER TABLE events ADD COLUMN started BOOLEAN DEFAULT false;`);
};

exports.down = (pgm) => {
  pgm.sql(`ALTER TABLE events DROP COLUMN started;`);
};
