const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose'); // New: Mongoose for MongoDB
require('dotenv').config();

const User = require('./models/User'); // New: Import User Schema

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Registration route
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check DB for existing user
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new user to MongoDB
        const newUser = new User({
            username,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user" });
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        // Find user in MongoDB
        const user = await User.findOne({ username: req.body.username });
        
        if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
            return res.status(401).send("Invalid credentials");
        }

        const token = jwt.sign({ user: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Set to true in production
            sameSite: 'lax',
            maxAge: 3600000 
        }).json({ message: "Logged in successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error during login" });
    }
});

app.post('/logout', (req, res) => {
    res.clearCookie('token').json({ message: "Logged out successfully" });
});

app.get('/api/user/profile', (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({
            message: "Profile fetched successfully",
            user: decoded 
        });
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
});