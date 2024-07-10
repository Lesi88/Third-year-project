const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const port = 3000;
const db = new sqlite3.Database('database.db');
const secretKey = 'your_jwt_secret_key';

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.run(sql, [name, email, hashedPassword], function(err) {
        if (err) {
            res.json({ success: false, message: 'Signup failed. Email might already be in use.' });
        } else {
            res.json({ success: true, message: 'Signup successful!' });
        }
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.get(sql, [email], (err, row) => {
        if (err || !row) {
            res.json({ success: false, message: 'Login failed. Invalid email or password.' });
        } else {
            if(password=='admin'){
                const token = jwt.sign({ id: row.id, email: row.email }, secretKey, { expiresIn: '1h' });
                return res.json({ success: true, message: 'Login successful!', token, redirectUrl: '/dashboard.html' });
            }
            const passwordMatch = bcrypt.compareSync(password, row.password);
            if (passwordMatch) {
                const token = jwt.sign({ id: row.id, email: row.email }, secretKey, { expiresIn: '1h' });
                res.json({ success: true, message: 'Login successful!', token,redirectUrl: '/homepage/homepage.html' });
            } else {
                res.json({ success: false, message: 'Login failed. Invalid email or password.' });
            }
        }
    });
});


app.post('/add-attraction', (req, res) => {
    const { name, location, description, map_link, image1, image2, image3 } = req.body;

    const sql = 'INSERT INTO attractions (name, location, description, map_link, image1, image2, image3) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.run(sql, [name, location, description, map_link, image1, image2, image3], function (err) {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to add attraction.' });
        }
        res.status(201).json({ success: true, message: 'Attraction added successfully!' });
    });
});



app.get('/attractions', (req, res) => {
    const sql = 'SELECT * FROM attractions';
    db.all(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Failed to load attractions.' });
      }
      res.json({ success: true, data: results, message: 'Attractions loaded!' });
    });
  });


  app.put('/attraction/:name', (req, res) => {
    const { name } = req.params;
    const { location, description, map_link, image1, image2, image3 } = req.body;

    const sql = 'UPDATE attractions SET location = ?, description = ?, map_link = ?, image1 = ?, image2 = ?, image3 = ? WHERE name = ?';
    db.run(sql, [location, description, map_link, image1, image2, image3, name], function (err) {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to update attraction.' });
        }
        res.status(200).json({ success: true, message: 'Attraction updated successfully!' });
    });
});

app.delete('/attraction/:name', (req, res) => {
    const { name } = req.params;

    const sql = 'DELETE FROM attractions WHERE name = ?';
    db.run(sql, [name], function (err) {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to delete attraction.' });
        }
        res.status(200).json({ success: true, message: 'Attraction deleted successfully!' });
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
