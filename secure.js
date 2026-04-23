const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('nyondo_stock.db');

// Validation 
function isValidName(name){
      return typeof name === 'string' && name.length && !/[<>;]/.test(name);
}

function isValidUsername(username){
      return typeof username === 'string' && username.length > 0 && !username.includes('');
}

function isValidPassword(password){
      return typeof password === 'string' && password.length >=6;
}
// safe search with validation
function searchProductSafe(name){
      if(!isValidName(name)){
            console.log('Error: Invalid Product name');
            return null;
      }

 const query = `SELECT id, name, cost_price, sell_price, stock FROM products WHERE name LIKE ?`;
 const rows =db.prepare(query).all(`%${name}%`);
 console.log('Result:', rows);
  return rows;
}


// safe login with validation
function loginSafe(username,password){
      if(!isValidUsername(username)){
      console.log('Error: Invalid Username');
      return null;
      }

if (!isValidPassword(password)){
      console.log('Error: Invalid password');
      return null;
}

      const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
      const row = db.prepare(query).get(username,password);

      console.log('Result:', row);
      return row;

}

// test cases for ptoduct search
console.log('Test 1:', searchProductSafe('cement'));

console.log('Test 2:', searchProductSafe(''));

console.log('Test 3:', searchProductSafe('<script>'));

// test case for log in
console.log('Test 4:', loginSafe('admin', 'admin123'));

console.log('Test 5:', loginSafe('admin' , 'ab'));

console.log('Test 6:', loginSafe('ad min', 'pass123'));














// // testing
// console.log('Test 1:', searchProductSafe("'OR 1=1--"));

// console.log('Test 2:', searchProductSafe("'UNION SELECT id ,username,password,role FROM users --"));

// console.log('Test 3:', loginSafe("admin' --", "anything"));

// console.log('Test 4:', loginSafe("'OR '1' = '1","'OR '1' ='1"));