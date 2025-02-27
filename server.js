const express = require('express'); // web framework for Node.js to handle HTTP requests
const cors = require('cors'); // allows for Cross-Origin Resource Sharing (allows frontend to communicate with backend on different ports)
const bodyParser = require('body-parser'); // parses incoming requests with JSON
const mysql = require('mysql2'); // module to connect to database

const app = express();
const PORT = 5000;


// Connect to database
var database = mysql.createConnection({
    host: "localhost",
    user: "viewer",
    password: "password",
    database: "StudentMarketplace"
});
database.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});



// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse incoming JSON requests

// Simple login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

    // Query the database
    // TODO error check, right now if the username doesn't exist it crashes the server, which we probably don't want
    database.query('SELECT password FROM UserProfiles WHERE email="' + username + '"', function (error, results, fields) {

        // retrieve the first (and hopefully only) password for the email
        const retrievedPassword = results[0].password

        // If the password is equal to the retrieved passowrd, then it was a succesful login
        if (password === retrievedPassword) {
            res.status(200).json({ message: 'Login successful', user: username });
        }
        // Otherwise, the password or username was wrong
        else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
