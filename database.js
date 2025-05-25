const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db.sqlite');

db.run(`CREATE TABLE IF NOT EXISTS channel (
  guildId TEXT,
  channelId TEXT,
  invite TEXT,
  PRIMARY KEY (guildId, channelId)
)`);

db.run(`CREATE TABLE IF NOT EXISTS user (
  userId TEXT,
  PRIMARY KEY (userId)
)`);

module.exports = db;