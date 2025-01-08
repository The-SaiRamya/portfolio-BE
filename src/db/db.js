const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

let db;

const initDb = async () => {
  db = await open({
    filename: './enquiries.db',
    driver: sqlite3.Database,
  });

  // Create the enquiries table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_date DATE GENERATED ALWAYS AS (DATE(created_at)) STORED,
      UNIQUE(email, created_date)
    );
  `);
  
};

const getDb = () => db;

module.exports = { initDb, getDb };
