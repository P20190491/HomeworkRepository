const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const fs = require('fs');


async function getDBConnection() {
	const db = await sqlite.open({
		filename: 'product.db',
		driver: sqlite3.Database
	});
	return db.getDatabaseInstance();
}

getDBConnection().then(db => {
	let product = fs.readFileSync('./product.json');
	let category = fs.readFileSync('./category.json');
	product = JSON.parse(product);
	category = JSON.parse(category);

	db.serialize(() => {
		// create product table
		db.prepare(`CREATE TABLE IF NOT EXISTS products (
			product_id INTEGER PRIMARY KEY AUTOINCREMENT,
			product_image TEXT,
			product_title TEXT,
			product_price INTEGER,
			product_category TEXT
		);`).run().finalize();
		
		// check count
		db.get(`SELECT count(product_id) FROM products;`, (err, data) => {
			if(data['count(product_id)'] > 0) {
				console.log('[+] Pre-built Database Detected.');
				console.log(`[+] Data Count : ${data['count(product_id)']}`);
				return;
			}
			
			console.log('[+] Adding Default Data');
						
			// insert default items from json
			let insert_query = db.prepare(`INSERT INTO products(product_title, product_image, product_price, product_category) VALUES(?, ?, ?, ?);`);
			
			for(let p of product) {	
				let ct = p.category.find(e => category.includes(e));
				insert_query.run(p.name, p.image, p.price, ct);
			}
			
			insert_query.finalize();

		});	
		
	});	
}).catch(e => {
	console.error(e);	
});

module.exports = getDBConnection;
