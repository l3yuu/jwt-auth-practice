const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();
const authMiddleware = require('./middleware/auth');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || "your_fallback_secret";

app.post('/login', (req, res) => {
    const { username } = req.body;
    
    const token = jwt.sign({ user: username }, SECRET_KEY, { expiresIn: '1h' });
    
    res.json({ token });
});

app.get('/api/user/profile', authMiddleware, (req, res) => {
    res.json({
        message: "Success! You accessed a protected route.",
        user: req.user 
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));