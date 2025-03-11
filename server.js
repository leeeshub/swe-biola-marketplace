const express = require('express'); // web framework for Node.js to handle HTTP requests
const cors = require('cors'); // allows for Cross-Origin Resource Sharing (allows frontend to communicate with backend on different ports)
const bodyParser = require('body-parser'); // parses incoming requests with JSON
const mysql = require('mysql2'); // module to connect to database

const app = express();
const PORT = 5000;


// Connect to database
var dbViewer = mysql.createConnection({
    host: "localhost",
    user: "viewer",
    password: "password",
    database: "StudentMarketplace"
});
var dbWriter = mysql.createConnection({
    host: "localhost",
    user: "writer",
    password: "password",
    database: "StudentMarketplace"
});



dbViewer.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});



// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse incoming JSON requests

// Simple login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

    // Query the database
    try {
        dbViewer.query('SELECT password FROM UserProfiles WHERE email="' + email + '"', function (err, results, fields) {
            // Throw any error with the query
            if (err) throw err;

            if (results.length < 1) {
                res.status(401).json({ message: 'Invalid credentials' });
            }
            else {
                // retrieve the first (and hopefully only) password for the email
                const retrievedPassword = results[0].password

                // If the password is equal to the retrieved passowrd, then it was a succesful login
                if (password === retrievedPassword) {
                    res.status(200).json({ message: 'Login successful', user: email });
                }
                // Otherwise, the password or username was wrong
                else {
                    res.status(401).json({ message: 'Invalid credentials' });
                }
            }
            
        });
    }
    catch(err) {
        res.status(401).json({ message: 'Invalid credentials' });
        console.log(err)
    }
});

app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    // Query the database
    try {
        dbViewer.query('SELECT * FROM UserProfiles WHERE email="' + email + '"', function (err, results, fields) {
            if (err) throw err;

            if (results.length > 1) {
                res.status(401).json({ message: 'Email is already in use' });
            }
            else {
                dbViewer.query('INSERT INTO UserProfiles (name, email, password) VALUES ("' + name + '", "' + email + '", "' + password + '")', function (err, results, fields) {
                    // Throw any error with the query
                    if (err) throw err;
                    else {
                        res.status(200).json({ message: 'New user created' });
                    }

                });
            }
        });
    }
    catch (err) {
        res.status(401).json({ message: 'Error in creating new user' });
        console.log(err)
    }

});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
