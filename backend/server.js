const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/noticeboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'));

// Notice Model
const Notice = mongoose.model('Notice', new mongoose.Schema({
  title: String,
  description: String,
  date: { type: Date, default: Date.now }
}));

// Static Admin
const ADMIN = {
  username: "admin",
  password: "password123" // In real app, use hashed passwords
};

// Login Route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN.username && password === ADMIN.password) {
    const token = jwt.sign({ username }, "secretkey", { expiresIn: "1h" });
    return res.json({ token });
  } else {
    return res.status(401).json({ message: "Invalid Credentials" });
  }
});

// Middleware to check token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, "secretkey", (err, decoded) => {
    if (err) return res.status(500).json({ message: "Failed to authenticate token" });
    req.user = decoded;
    next();
  });
};

// Get all notices (Public)
app.get('/api/notices', async (req, res) => {
  const notices = await Notice.find().sort({ date: -1 });
  res.json(notices);
});

// Add notice (Admin only)
app.post('/api/notices', verifyToken, async (req, res) => {
  const newNotice = new Notice(req.body);
  await newNotice.save();
  res.json(newNotice);
});

// Delete notice (Admin only)
app.delete('/api/notices/:id', verifyToken, async (req, res) => {
  await Notice.findByIdAndDelete(req.params.id);
  res.json({ message: "Notice deleted" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
