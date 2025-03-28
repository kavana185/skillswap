const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Signup Route (Plaintext Passwords)
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!password) return res.status(400).json({ error: "Password is required" });

    const newUser = new User({ name, email, password }); // Store plaintext password
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login Route (Direct Password Check)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "User not found" });
    if (user.password !== password) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
