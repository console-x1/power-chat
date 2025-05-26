
// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat

const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db.sqlite');

db.run(`CREATE TABLE IF NOT EXISTS channel (
  guildId TEXT,
  channelId TEXT,
  invite TEXT,
  webhook TEXT,
  PRIMARY KEY (guildId, channelId)
)`);

db.run(`CREATE TABLE IF NOT EXISTS user (
  userId TEXT,
  PRIMARY KEY (userId)
)`);

module.exports = db;

// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat