/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.query(`ALTER TABLE creatures ADD COLUMN joined BOOLEAN DEFAULT false;`);
};

exports.down = (pgm) => {
  pgm.query(`ALTER TABLE creatures DROP COLUMN joined;`);
};
