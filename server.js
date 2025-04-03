const express = require("express"); // web framework for Node.js to handle HTTP requests
const cors = require("cors"); // allows for Cross-Origin Resource Sharing (allows frontend to communicate with backend on different ports)
const bodyParser = require("body-parser"); // parses incoming requests with JSON
const mysql = require("mysql2"); // module to connect to database
const fs = require("fs")

const app = express();
const PORT = 4000;

// Connect to database
var dbViewer = mysql.createConnection({
  host: "localhost",
  user: "viewer",
  password: "password",
  database: "StudentMarketplace",
});
var dbWriter = mysql.createConnection({
  host: "localhost",
  user: "writer",
  password: "password",
  database: "StudentMarketplace",
});
var dbDeleter = mysql.createConnection({
  host: "localhost",
  user: "destroyerOfData",
  password: "password",
  database: "StudentMarketplace",
});

dbViewer.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse incoming JSON requests


async function checkSession(session_id) {
    return new Promise((resolve, reject) => {
        try {
            // Query to see if the session ID is for a valid user
            dbViewer.query('SELECT user_id, created_at FROM Sessions WHERE session_id="' + session_id + '"', function (err, results, fields) {
                // Throw any error with the query
                if (err) {
                    reject(err); // Reject promise with error
                    return;
                }

                // If results are less than 1, then there is no user with that session ID
                if (results.length < 1) {
                    return resolve(-1); // Resolve with 0 if no valid session found
                }
                else {
                    // store the results of the first (and hopefully only) query for that session
                    const retrievedUserID = results[0].user_id;
                    const retrievedCreatedAt = results[0].created_at;

                    // If they have a session ID, make sure it is valid and hasn't expired (86400000 is 1 day in milliseconds)
                    if (Date.now() - retrievedCreatedAt < 86400000) {
                        return resolve(retrievedUserID); // Resolve with user_id if session is valid
                    }
                    // If it has expired
                    else {
                        return resolve(-1); // Resolve with 0 if session is expired
                    }
                }
            });

        } catch (err) {
            console.log(err);
            return reject(err); // Reject promise with error
        }
    });
}

// Simple login endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  try {
    // Query for the user that has the email
    dbViewer.query(
      'SELECT UserProfiles.user_id, password, session_id, created_at FROM (UserProfiles LEFT JOIN Sessions ON UserProfiles.user_id = Sessions.user_id) WHERE email="' +
        email +
        '"',
      function (err, results, fields) {
        // Throw any error with the query
        if (err) throw err;

        // If results are less than 1, then there is no user with that email
        if (results.length < 1) {
          res.status(401).json({ message: "Invalid credentials" });
        } else {
          // store the results of the first (and hopefully only) query for that email
          const retrievedPassword = results[0].password;
          const retrievedUserID = results[0].user_id;
          const retrievedSessionID = results[0].session_id;
          const retrievedCreatedAt = results[0].created_at;

          // If the password is equal to the retrieved passowrd, then it was a succesful login
          if (password === retrievedPassword) {
            // If the session ID is null, then the user has no session ID
            if (retrievedSessionID === null) {
              // Since they have no session ID, create a new one
              dbViewer.query(
                "SELECT UUID() AS session_id",
                function (err, results, fields) {
                  // Throw any error with the query
                  if (err) throw err;

                  // Store the session ID
                  const session_id = results[0].session_id;

                  // Insert the session ID into the Sessions table
                  dbWriter.query(
                    'INSERT INTO Sessions (session_id, user_id, created_at) VALUES ("' +
                      session_id +
                      '", "' +
                      retrievedUserID +
                      '", "' +
                      Date.now() +
                      '")',
                    function (err, results, fields) {
                      // Throw any error with the query
                      if (err) throw err;
                    }
                  );

                  // The login was succesful, return the session ID
                  res.status(200).json({
                    message: "Login successful",
                    user: email,
                    session: session_id,
                  });
                }
              );
            }
            // If they have a session ID, but the ID has expired (86400000 is 1 day in miliseconds)
            else if (Date.now() - retrievedCreatedAt > 86400000) {
              // Create a new session ID
              dbViewer.query(
                "SELECT UUID() AS session_id",
                function (err, results, fields) {
                  // Throw any error with the query
                  if (err) throw err;

                  // Store the session ID
                  const session_id = results[0].session_id;

                  // Update the Sessions table with the new session ID for that user
                  dbWriter.query(
                    'UPDATE Sessions SET session_id = "' +
                      session_id +
                      '", created_at = "' +
                      Date.now() +
                      '" WHERE user_id = "' +
                      retrievedUserID +
                      '"',
                    function (err, results, fields) {
                      if (err) throw err;
                    }
                  );

                  // The login was succesful, return the new session ID
                  res.status(200).json({
                    message: "Login successful",
                    user: email,
                    session: session_id,
                  });
                }
              );
            }
            // They already have a session ID
            else {
              // The login was succesful, return their session ID
              res.status(200).json({
                message: "Login successful",
                user: email,
                session: retrievedSessionID,
              });
            }
          }
          // Otherwise, the password or username was wrong
          else {
            res.status(401).json({ message: "Invalid credentials" });
          }
        }
      }
    );
  } catch (err) {
    // If there was any errors with one of the queries, then just return a failed login to the user
    res.status(401).json({ message: "Invalid credentials" });
    console.log(err);
  }
});

app.post('/checksession', async function(req, res) {
    const { session_id } = req.body;

    try {
        const retrievedUserID = await checkSession(session_id);

        console.log(retrievedUserID);
        if (retrievedUserID > 0) {
            res
                .status(200)
                .json({ message: "Valid Session_ID", user_id: retrievedUserID });
        } else {
            res.status(401).json({ message: "Not a valid session" });
        }
    } catch (err) {
        // If there was any errors with one of the queries, then just return a failed login to the user
        res.status(401).json({ message: "Not a valid session" });
        console.log(err);
    }
});

app.post("/signup", (req, res) => {
  // The body of the post request should hold the three elements of the new user
  const { name, email, password } = req.body;

  try {
    // Check if the email is used
    dbViewer.query(
      'SELECT * FROM UserProfiles WHERE email="' + email + '"',
      function (err, results, fields) {
        if (err) throw err;
        // If there is a result, the email is already used
        if (results.length > 0) {
          res.status(401).json({ message: "Email is already in use" });
        }
        // Otherwise insert it into database
        else {
          dbWriter.query(
            'INSERT INTO UserProfiles (name, email, password) VALUES ("' +
              name +
              '", "' +
              email +
              '", "' +
              password +
              '")',
            function (err, results, fields) {
              if (err) throw err;
              // New user has been created
              dbViewer.query(
                "SELECT UUID() AS session_id",
                function (err, results, fields) {
                  // Throw any error with the query
                  if (err) throw err;

                  // Store the session ID
                  const session_id = results[0].session_id;

                  res
                    .status(200)
                    .json({ message: "New user created", session: session_id });
                }
              );
            }
          );
        }
      }
    );
  } catch (err) {
    res.status(401).json({ message: "Error in creating new user" });
    console.log(err);
  }
});

app.post("/post", (req, res) => {
  console.log("Post received");

    //console.log(req.body)
  // The body of the post should contain the information needed to create a new post
  // Whenever the post page is created, this can be adjusted to match the actual request
    const {
        session_id,
    title,
    price,
    category,
        description,
      images,
      
    } = req.body;

    console.log(title);
    let type = 1;
    let item = title;
    let author = "NULL";
    let isbn = "NULL";
    

  try {
    // Get the user from the user's session id
    dbViewer.query(
      'SELECT user_id FROM Sessions WHERE session_id="' + session_id + '"',
      function (err, results, fields) {
        if (err) throw err;

        // If there isn't any results, then the session ID is invalid
        if (results.length < 1) {
          res.status(401).json({ message: "Session ID is invalid" });
        }
        // If the session ID is valid
        else {
          // Get the user ID
            const user_id = results[0].user_id;



          // Insert the post into the Posts table
          dbWriter.query(
            'INSERT INTO Posts (user_id, post_title, price, type, category, status, created_at) VALUES ("' +
              user_id +
              '", "' +
              title +
              '", "' +
              price +
              '", "' +
              type +
              '", "' +
              category +
              '", "Listed", NOW() )',
            function (err, results, fields) {
              if (err) throw err;
              // Store the post ID that is inserted
              const post_id = results.insertId;

              // Insert into the Items table
              // If we choose to add multiple items for a post, then this will need to be changed
              dbWriter.query(
                'INSERT INTO Items (post_id, item, description, author, isbn) VALUES ("' +
                  post_id +
                  '", "' +
                  item +
                  '", "' +
                  description +
                  '", "' +
                  author +
                  '", ' +
                  isbn +
                  ')',
                function (err, results, fields) {
                  if (err) throw err;

                    //console.log(images);
                    if (images) {
                        const url = `src/Images/${images[0].uid}.${images[0].type.split('/')[1]}`
                        console.log(url);

                        fs.writeFileSync(url, images[0].thumbUrl);

                        

                        dbWriter.query(`INSERT INTO Images (post_id, image_name, image_url) VALUES ("${post_id}", "${images[0].name}", "${url}")`, function (err, results, fields) {
                            if (err) throw err
                        });
                    }

                  // Post succesfully created
                  res.status(200).json({ message: "New post created" });
                }
              );
            }
          );
        }
      }
    );
  } catch (err) {
    // Error with the queries
    res.status(401).json({ message: "Error in creating post" });
    console.log(err);
  }
});

// Example Post Post request body:
// { "session_id": "c0e49364-0047-11f0-94ae-0a0027000014", "post_title": "New Post created by a Post request", "price": "10000.00", "type": "1", "category": "Stuff", "item": "The item of the post", "description": "This is the description", "author": "me", "isbn": "10234" }

app.post("/post-edit", (req, res) => {
  console.log("Post edit receieved");

  // The body of the post should contain the information needed to create a new post
  // Whenever the post page is created, this can be adjusted to match the actual request
  const {
    session_id,
    post_id,
    post_title,
    price,
    type,
    category,
    item,
    description,
    author,
    isbn,
  } = req.body;

  try {
    // Get the user from the user's session id
    dbViewer.query(
      'SELECT user_id FROM Sessions WHERE session_id="' + session_id + '"',
      function (err, results, fields) {
        if (err) throw err;

        // If there isn't any results, then the session ID is invalid
        if (results.length < 1) {
          res.status(401).json({ message: "Session ID is invalid" });
        }
        // If the session ID is valid
        else {
          // Get the user ID
          const user_id = results[0].user_id;

          dbViewer.query(
            'SELECT user_id FROM Posts WHERE post_id ="' + post_id + '"',
            function (err, results, fields) {
              // If there is a post with the id
              if (results.length > 0) {
                // If it is the correct user
                if (user_id === results[0].user_id) {
                  dbWriter.query(
                    'UPDATE Posts SET post_title = "' +
                      post_title +
                      '", price = "' +
                      price +
                      '", type = "' +
                      type +
                      '", category = "' +
                      category +
                      '" WHERE post_id = "' +
                      post_id +
                      '"',
                    function (err, results, fields) {
                      if (err) throw err;

                      // Update the Items table
                      // If we choose to add multiple items for a post, then this will need to be changed
                      dbWriter.query(
                        'UPDATE Items SET item = "' +
                          item +
                          '", description = "' +
                          description +
                          '", author = "' +
                          author +
                          '", isbn = "' +
                          isbn +
                          '" WHERE post_id = "' +
                          post_id +
                          '"',
                        function (err, results, fields) {
                          if (err) throw err;

                          // Post succesfully edited
                          res
                            .status(200)
                            .json({ message: "Post has been edited" });
                        }
                      );
                    }
                  );
                }
                // Else, a user is trying to edit someone elses post
                else {
                  res
                    .status(401)
                    .json({ message: "Post doesn't belong to user" });
                }
              }
              // Else, there is no post with the id
              else {
                res.status(401).json({ message: "Post doesn't exist" });
              }
            }
          );
        }
      }
    );
  } catch (err) {
    // Error with the queries
    res.status(401).json({ message: "Error in creating post" });
    console.log(err);
  }
});

app.post("/post-delete", (req, res) => {
  const { session_id, post_id } = req.body;

  try {
    const retrievedUserID = checkSession(session_id);

    if (retrievedUserID !== 0) {
      dbViewer.query(
        'SELECT user_id FROM Posts WHERE post_id ="' + post_id + '"',
        function (err, results, fields) {
          // If there is a post with the id
          if (results.length > 0) {
            // If it is the correct user
            if (retrievedUserID === results[0].user_id) {
              // Delete the post and related items
              dbDeleter.query(
                'DELETE FROM Posts WHERE post_id = ""',
                function (err, results, fields) {
                  if (err) throw err;

                  dbDeleter.query(
                    'DELETE FROM Items WHERE post_id = ""',
                    function (err, results, fields) {
                      if (err) throw err;
                      res
                        .status(200)
                        .json({ message: "Post has been destroyed" });
                    }
                  );
                }
              );
            }
            // Else, a user is trying to edit someone elses post
            else {
              res.status(401).json({ message: "Post doesn't belong to user" });
            }
          }
          // Else, there is no post with the id
          else {
            res.status(401).json({ message: "Post doesn't exist" });
          }
        }
      );

      res
        .status(200)
        .json({ message: "Valid Session_ID", user_id: retrievedUserID });
    } else {
      res.status(401).json({ message: "Not a valid session" });
    }
  } catch (err) {
    // If there was any errors with one of the queries, then just return a failed login to the user
    res.status(401).json({ message: "Not a valid session" });
    console.log(err);
  }
});


app.post("/get", async function (req, res) {
    const { session_id } = req.body;
    try {
        const retrievedUserID = await checkSession(session_id);

        dbViewer.query(
            //`SELECT name, post_title, price, created_at, description FROM (Posts LEFT JOIN Items ON Posts.post_id = Items.post_id LEFT JOIN UserProfiles ON Posts.user_id = UserProfiles.user_id) WHERE Posts.user_id != ${retrievedUserID}`,
            `SELECT name, post_title, price, created_at, description, image_url FROM (((Posts LEFT JOIN Items ON Posts.post_id = Items.post_id) LEFT JOIN UserProfiles ON Posts.user_id = UserProfiles.user_id)) LEFT JOIN Images ON Posts.post_id = Images.post_id`,
            function (err, results, fields) {
                if (err) throw err;

                for (var i in results) {
                    //console.log(results[i].image_url);
                    if (results[i].image_url !== null) {
                        results[i].image_url = fs.readFileSync(results[i].image_url, 'utf8');
                        //console.log(results[i].image_url);
                    }
                    else {
                        results[i].image_url = "https://img.icons8.com/ios/100/image.png"
                    }
                }

                res.status(200).json({ message: "Selected", response: results });
            });

    } catch (err) {
        // If there was any errors with one of the queries, then just return a failed login to the user
        res.status(401).json({ message: "Error in retrieving posts" });
        console.log(err);
    }
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
