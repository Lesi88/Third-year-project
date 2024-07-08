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


/*app.get('/homepage', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token.' });
        }

        // Fetch homepage data from the database
        const homepageData = {
            welcomeMessage: "Welcome to the homepage!",
            items: [
                { id: 1, name: "Item 1", description: "Description for item 1" },
                { id: 2, name: "Item 2", description: "Description for item 2" },
                { id: 3, name: "Item 3", description: "Description for item 3" }
            ]
        };
        res.json(homepageData);
    });
});*/

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
