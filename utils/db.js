const { createPool } = require("mysql2/promise");

const pool = createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "streamers",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // only for mac users
  socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
});

module.exports = pool;
