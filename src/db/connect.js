const mongoose = require("mongoose");
const mogoUrl="mongodb://127.0.0.1:27017/middleware"
const connect = async () => {
  try {
    await mongoose.connect(mogoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

module.exports = connect;
