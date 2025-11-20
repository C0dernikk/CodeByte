const mongoose = require("mongoose");

const connectToDatabase = async () => {
  await mongoose.connect(process.env.MONGO_URL);
};

module.exports = { connectToDatabase };
