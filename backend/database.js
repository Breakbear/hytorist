const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'hytorist.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initDatabase();
  }
});

function initDatabase() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      product TEXT,
      quantity TEXT,
      category TEXT,
      privacy TEXT NOT NULL DEFAULT 'confidential' CHECK (privacy IN ('public', 'confidential')),
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'contacted', 'completed', 'rejected'))
    )`, (err) => {
      if (err) {
        console.error('Error creating inquiries table:', err.message);
      } else {
        console.log('Inquiries table ready');
      }
    });

    ensureColumn('inquiries', 'category', 'TEXT');
    ensureColumn(
      'inquiries',
      'privacy',
      "TEXT NOT NULL DEFAULT 'confidential' CHECK (privacy IN ('public', 'confidential'))"
    );

    db.run(
      'CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC)',
      (err) => {
        if (err) {
          console.error('Error creating inquiries index:', err.message);
        }
      }
    );

    db.run(`CREATE TABLE IF NOT EXISTS cms_page_overrides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      locale TEXT NOT NULL CHECK (locale IN ('zh', 'en')),
      section_key TEXT NOT NULL,
      page_id TEXT NOT NULL,
      content_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(locale, section_key, page_id)
    )`, (err) => {
      if (err) {
        console.error('Error creating cms_page_overrides table:', err.message);
      } else {
        console.log('CMS page overrides table ready');
      }
    });

    db.run(
      'CREATE INDEX IF NOT EXISTS idx_cms_page_overrides_locale ON cms_page_overrides(locale)',
      (err) => {
        if (err) {
          console.error('Error creating cms_page_overrides locale index:', err.message);
        }
      }
    );

    db.run(`CREATE TABLE IF NOT EXISTS site_resource_overrides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scope TEXT NOT NULL UNIQUE,
      content_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating site_resource_overrides table:', err.message);
      } else {
        console.log('Site resource overrides table ready');
      }
    });
  });
}

function ensureColumn(tableName, columnName, definition) {
  db.all(`PRAGMA table_info(${tableName})`, (err, rows) => {
    if (err) {
      console.error(`Error reading schema for ${tableName}:`, err.message);
      return;
    }

    const hasColumn = Array.isArray(rows) && rows.some((row) => row.name === columnName);
    if (hasColumn) {
      return;
    }

    db.run(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`, (alterErr) => {
      if (alterErr) {
        console.error(`Error adding ${columnName} to ${tableName}:`, alterErr.message);
        return;
      }
      console.log(`Added ${columnName} column to ${tableName}`);
    });
  });
}

module.exports = db;
