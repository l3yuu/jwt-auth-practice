const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const app = express();

// --- CORS CONFIGURATION ---
const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
// --------------------------

app.use(express.json());
app.use(cookieParser());

// IMPORTANT: Singleton pattern for MongoDB connection (Vercel serverless optimization)
let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('Using existing MongoDB connection');
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000,
        });

        isConnected = db.connections[0].readyState === 1;
        console.log('✅ New MongoDB connection established');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        throw error;
    }
};

// Registration route
app.post('/register', async (req, res) => {
    try {
        await connectDB(); // Ensure connection before DB operation
        
        const { username, password } = req.body;

        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("REGISTRATION ERROR:", error);
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        await connectDB(); // Ensure connection before DB operation
        
        const user = await User.findOne({ username: req.body.username });
        
        if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ user: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ 
            message: "Logged in successfully",
            token: token,
            user: user.username 
        });
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({ message: "Server error during login", error: error.message });
    }
});

// Logout route
app.post('/logout', (req, res) => {
    res.json({ message: "Logged out successfully" });
});

// Middleware to verify JWT from Authorization header
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("TOKEN VERIFICATION ERROR:", err);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

// Profile route
app.get('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        await connectDB(); // Ensure connection before DB operation
        
        res.json({
            message: "Profile fetched successfully",
            user: req.user 
        });
    } catch (error) {
        console.error("PROFILE ERROR:", error);
        res.status(500).json({ message: "Error fetching profile" });
    }
});

// Health check
app.get('/', (req, res) => {
    res.send("Backend is running and ready for requests!");
});

const PORT = process.env.PORT || 5000;

// Only start server if not in serverless environment
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}`);
    });
}

module.exports = app;