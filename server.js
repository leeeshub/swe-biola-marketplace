const express = require('express'); // web framework for Node.js to handle HTTP requests
const cors = require('cors'); // allows for Cross-Origin Resource Sharing (allows frontend to communicate with backend on different ports)
const bodyParser = require('body-parser'); // parses incoming requests with JSON

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse incoming JSON requests

// Simple login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Replace with real authentication logic
  if (username === 'user' && password === 'password') {
    res.status(200).json({ message: 'Login successful', user: username });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
