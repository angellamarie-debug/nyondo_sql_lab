const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('nyondo_stock.db');

// safe search
function searchProductSafe(name) {
 const query = `SELECT id, name, cost_price, sell_price, stock FROM products WHERE name LIKE ?`;
 const rows =db.prepare(query).all(`%${name}%`);
 console.log('Result:', rows);
  return rows;
}


// safe login
function loginSafe(username,password){
      const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
      const row = db.prepare(query).get(username,password);

      console.log('Result:', row);
      return row;

}

// testing
console.log('Test 1:', searchProductSafe("'OR 1=1--"));

console.log('Test 2:', searchProductSafe("'UNION SELECT id ,username,password,role FROM users --"));

console.log('Test 3:', loginSafe("admin' --", "anything"));

console.log('Test 4:', loginSafe("'OR '1' = '1","'OR '1' ='1"));