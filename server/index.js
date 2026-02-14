const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;

// This would usually be in your .env file
const SECRET_KEY = "your_super_secret_key_here";

app.post('/login', (req, res) => {
    // For now, we'll mock a user. In your real project, check the database!
    const { username } = req.body;
    
    // Create a token that expires in 1 hour
    const token = jwt.sign({ user: username }, SECRET_KEY, { expiresIn: '1h' });
    
    res.json({ token });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));