const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
  user1: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  user2: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
});

module.exports = mongoose.model("Match", MatchSchema);
