const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('nyondo_stock.db');

console.log('='.repeat(60));
console.log('  EXPLORING NYONDO STOCK DATABASE');
console.log('='.repeat(60));

console.log('\n--- Query A: All products ---');
db.prepare('SELECT * FROM products').all().forEach(r => {
  console.log(`  [${r.id}] ${r.name.padEnd(20)}  cost=${String(r.cost_price.toLocaleString()).padStart(8)}  sell=${String(r.sell_price.toLocaleString()).padStart(8)}  stock=${r.stock}`);
});

 console.log('\n--- Query B: Name and sell price only ---');
db.prepare('SELECT id, name, sell_price FROM products').all().forEach(r => {
  console.log(`  [${r.id}] ${r.name.padEnd(20)}  UGX ${r.sell_price.toLocaleString()}`);
 });

console.log('\n--- Query C: Product with id = 3 ---');
const one = db.prepare('SELECT * FROM products WHERE id = 3').get();
console.log(`  Name:       ${one.name}`);
console.log(`  Cost price: UGX ${one.cost_price.toLocaleString()}`);
console.log(`  Sell price: UGX ${one.sell_price.toLocaleString()}`);
console.log(`  Stock:      ${one.stock} units`);

console.log("\n--- Query D: Products with 'sheet' in the name ---");
db.prepare("SELECT * FROM products WHERE name LIKE '%sheet%'").all()
.forEach(r => console.log(`  [${r.id}] ${r.name}`));

console.log('\n--- Query E: Products sorted by sell price (highest first) ---');
db.prepare('SELECT name, sell_price FROM products ORDER BY sell_price DESC').all()
.forEach(r => console.log(`  ${r.name.padEnd(20)}  UGX ${r.sell_price.toLocaleString()}`));

console.log('\n--- Query F: two most expensive products ---');
db.prepare('SELECT id, name, sell_price FROM products ORDER BY sell_price DESC LIMIT 2').all()
.forEach(r => console.log(`  [${r.id}] ${r.name.padEnd(20)}  UGX ${r.sell_price.toLocaleString()}`));

console.log('\n--- Query G: Update the price of Cement (id=1) to 38,000 ---');
db.prepare('UPDATE products SET sell_price = 38000 WHERE id = 1').run();
const cement = db.prepare('SELECT * FROM products WHERE id = 1').get();
console.log(`  Updated price of ${cement.name} is now UGX ${cement.sell_price.toLocaleString()}`);
