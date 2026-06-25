const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  
  password: '',  
  database: 'waterdb'  
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to database');
  }
});

// Route for campaigndetail
app.get('/campaigndetail', (req, res) => {
  db.query('SELECT * FROM campaigndetail', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Route for variabledetail
app.get('/variabledetail', (req, res) => {
  db.query('SELECT * FROM variabledetail', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Route for tooldetail
app.get('/tooldetail', (req, res) => {
  db.query('SELECT * FROM tooldetail', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Route for guidedetail
app.get('/guidedetail', (req, res) => {
  db.query('SELECT * FROM guidedetail', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
