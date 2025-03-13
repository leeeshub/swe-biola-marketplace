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
        dbViewer.query('SELECT UserProfiles.user_id, password, session_id, created_at FROM (UserProfiles LEFT JOIN Sessions ON UserProfiles.user_id = Sessions.user_id) WHERE email="' + email + '"', function (err, results, fields) {
            // Throw any error with the query
            if (err) throw err;

            if (results.length < 1) {
                res.status(401).json({ message: 'Invalid credentials' });
            }
            else {
                // retrieve the first (and hopefully only) password for the email
                const retrievedPassword = results[0].password
                const retrievedUserID = results[0].user_id
                const retrievedSessionID = results[0].session_id
                const retrievedCreatedAt = results[0].created_at


                // If the password is equal to the retrieved passowrd, then it was a succesful login
                if (password === retrievedPassword) {
                    if (retrievedSessionID === null) {
                        dbViewer.query('SELECT UUID() AS sid', function (err, results, fields) {
                            if (err) throw err;

                            const session_id = results[0].sid;


                            dbWriter.query('INSERT INTO Sessions (session_id, user_id, created_at) VALUES ("' + session_id + '", "' + retrievedUserID + '", "' + Date.now() + '")', function (err, results, fields) {
                                if (err) throw err;
                            });

                            res.status(200).json({ message: 'Login successful', user: email, session: session_id });
                        });
                    }
                    else if (Date.now() - retrievedCreatedAt > 86400000) {
                        dbViewer.query('SELECT UUID() AS sid', function (err, results, fields) {
                            if (err) throw err;

                            const session_id = results[0].sid;
                            dbWriter.query('UPDATE Sessions SET session_id = "' + session_id + '", created_at = "' + Date.now() + '" WHERE user_id = "' + retrievedUserID + '"', function (err, results, fields) {
                                if (err) throw err;
                            });

                            res.status(200).json({ message: 'Login successful', user: email, session: session_id });
                        });
                    }
                    else {
                        res.status(200).json({ message: 'Login successful', user: email, session: retrievedSessionID });
                    }
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

    // The body of the post request should hold the three elements of the new user
    const { name, email, password } = req.body;
    
    try {
        // Check if the email is used
        dbViewer.query('SELECT * FROM UserProfiles WHERE email="' + email + '"', function (err, results, fields) {
            if (err) throw err;

            // If there is a result, the email is already used
            if (results.length > 0) {
                res.status(401).json({ message: 'Email is already in use' });
            }
            // Otherwise insert it into database
            else {
                dbWriter.query('INSERT INTO UserProfiles (name, email, password) VALUES ("' + name + '", "' + email + '", "' + password + '")', function (err, results, fields) {
                    if (err) throw err;
                    // New user has been created
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

app.post('/post', (req, res) => {

    console.log("Post received")


    // The body of the post should contain the information needed to create a new post
    // Whenever the post page is created, this can be adjusted to match the actual request
    const { session_id, post_title, price, type, category, item, description, author, isbn } = req.body;

    try {
        // Get the user from the user's session id
        dbViewer.query('SELECT user_id FROM Sessions WHERE session_id="' + session_id + '"', function (err, results, fields) {

            if (err) throw err;

            // If there isn't any results, then the session ID is invalid
            if (results.length < 1) {
                res.status(401).json({ message: 'Session ID is invalid' });
            }
            // If the session ID is valid
            else {
                // Get the user ID
                const user_id = results[0].user_id

                // Insert the post into the Posts table
                dbWriter.query('INSERT INTO Posts (user_id, post_title, price, type, category, status, created_at) VALUES ("' + user_id + '", "' + post_title + '", "' + price + '", "' + type + '", "' + category + '", "Listed", NOW() )', function (err, results, fields) {

                    if (err) throw err;
                    // Store the post ID that is inserted
                    const post_id = results.insertId;

                    // Insert into the Items table
                    // If we choose to add multiple items for a post, then this will need to be changed
                    dbWriter.query('INSERT INTO Items (post_id, item, description, author, isbn) VALUES ("' + post_id + '", "' + item + '", "' + description + '", "' + author + '", "' + isbn + '")', function (err, results, fields) {

                        if (err) throw err;

                        // Post succesfully created
                        res.status(200).json({ message: 'New post created' });
                    });
                });
            }
            
        });
    }
    // Error with the queries
    catch (err) {
        res.status(401).json({ message: 'Error in creating post' });
        console.log(err)
    }


});

// Example Post Post request body:
// { "session_id": "c0e49364-0047-11f0-94ae-0a0027000014", "post_title": "New Post created by a Post request", "price": "10000.00", "type": "1", "category": "Stuff", "item": "The item of the post", "description": "This is the description", "author": "me", "isbn": "10234" }


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
