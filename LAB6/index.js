const PORT = 3000;

const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const fs = require('fs');

const getDB = require('./database');
const comment = require('./comment');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
	// get categories
	let db = await getDB();
	
	db.all(`SELECT DISTINCT product_category FROM products`, (err, data) => {
		if(err) {
			res.status(500).send(`DB Error : ${err}`);
		}
		else {
			let categories = Array.from(data.map(x => x.product_category));
			res.render('index', {category: categories});
		}
	});
});

app.get('/login', (req, res) => {
	res.render('login');
});

app.get('/signup', (req, res) => {
	res.render('signup');
});

app.get('/product/search/:startIdx/:endIdx', async (req, res) => {
	let db = await getDB();
	let keyword = req.query.keyword;
	let category = req.query.category;

	let startIdx = req.params.startIdx;
	let endIdx = req.params.endIdx;

	if(startIdx === undefined) startIdx = 0;
	if(keyword === undefined) endIdx = -1;
	if(keyword === undefined) keyword = '';
	if(category === undefined) category = null;
		
	db.all(`SELECT * FROM products WHERE product_title LIKE '%' || ? ||'%' AND (? IS NULL OR product_category = ?) LIMIT ?, ?`, [keyword, category, category, startIdx, endIdx], (err, data) => {
		if(err) {
			res.status(400).send(err);
			return;
		}
		res.send(data);
	});
});

app.get('/product/:product_id', async (req, res) => {
	if(isNaN(req.params.product_id)) {
		res.status(400).send('Bad Request');	
		return;
	}
	
	let db = await getDB();

	db.all(`SELECT * FROM products WHERE product_id = ?`, [req.params.product_id], (err, data) => {
		if(err) {
			console.error(err);
			res.status(500).send('Unknown Error');
			return;
		}
		if(data.length <= 0) {
			res.status(404).send('Not Found');
			return;
		}

		data = data[0];

		data.comments = comment.getComments(data.product_id); 
		data.nocomment = false;

		if(data.comments == null) {
			data.nocomment = true;	
			data.comments = [];
		}

		res.render('detail', data);
	});
});

app.post('/comment', (req, res) => {
	let id = req.body.id;
	let comment_text = req.body.comment;
	comment.addComment(id, comment_text);
	res.redirect(`/product/${id}`);
});

app.listen(PORT);
