const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');

const DB_FILE = 'nyondo_stock.db';

// Remove old database so we start fresh every time
if (fs.existsSync(DB_FILE)) {
  fs.unlinkSync(DB_FILE);
  console.log('Removed old database.');
}

const db = new DatabaseSync(DB_FILE);

db.exec(`
  CREATE TABLE products (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    description TEXT,
    cost_price  REAL    NOT NULL,
    sell_price  REAL    NOT NULL,
    stock       INTEGER DEFAULT 0
  );

  CREATE TABLE users (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT    NOT NULL UNIQUE,
    password TEXT    NOT NULL,
    role     TEXT    DEFAULT 'attendant'
  );

  CREATE TABLE orders (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER,
    product_id INTEGER,
    quantity   INTEGER,
    total      REAL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insert products
const insertProduct = db.prepare(
  'INSERT INTO products (name, description, cost_price, sell_price, stock) VALUES (?, ?, ?, ?, ?)'
);
const products = [
  ['Cement (bag)', 'Portland cement 50kg bag',28000, 35000, 500],
  ['Iron Sheet 3m', 'Gauge 30 roofing sheet 3m long', 85000, 110000, 120],
  ['Paint 5L', 'Exterior wall paint white 5L', 45000, 60000, 80],
  ['Nails 1kg', 'Common wire nails 1kg pack', 8000, 12000, 300],
  ['Timber 2x4', 'Pine timber plank 2x4 per metre', 18000, 25000, 60],
];
products.forEach(p => insertProduct.run(...p));


// Insert users
const insertUser = db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)');
const users = [
  ['admin',  'admin123', 'admin'],
  ['fatuma', 'pass456',  'attendant'],
  ['wasswa', 'pass789',  'manager'],
  ['aisha',  'qwerty',   'attendant'],
];
users.forEach(u => insertUser.run(...u));

// Select from
const rows = db.prepare('SELECT * FROM products').all();
console.log(rows);

db.close();

// console.log('==================================================');
// console.log('  nyondo_stock.db created successfully!');
// console.log('==================================================');
// console.log();
// console.log('Tables created:   products | users | orders');
// console.log('Products seeded:  7 products');
// console.log('Users seeded:     4 users (admin, fatuma, wasswa, aisha)');
// console.log();
// console.log("Run 'node 01_explore.js' to start exploring.");
