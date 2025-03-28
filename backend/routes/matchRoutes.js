const express = require("express");
const Match = require("../models/Match");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Get all matches (New Route)
router.get("/", async (req, res) => {
  try {
    const matches = await Match.find().populate("user1 user2", "name email"); 
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get recommended matches
router.get("/recommendations", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const recommendations = await User.find({
      skillsOffered: { $in: user.skillsWanted },
      _id: { $ne: user._id },
    });
    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send match request
router.post("/request", authMiddleware, async (req, res) => {
  try {
    const { matchId } = req.body;
    const newMatch = new Match({ user1: req.user.id, user2: matchId });
    await newMatch.save();
    res.status(201).json({ message: "Match request sent!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Accept/Reject match request
router.put("/respond", authMiddleware, async (req, res) => {
  try {
    const { matchId, status } = req.body;
    await Match.findByIdAndUpdate(matchId, { status });
    res.json({ message: "Response updated!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
