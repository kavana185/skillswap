const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/skillswap", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Locally...");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed", error);
    process.exit(1);
  }
};

connectDB();
module.exports = mongoose;
