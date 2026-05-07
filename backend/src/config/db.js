import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Adding these options helps with DNS resolution in some environments
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS:5000, // 5 second timeout for initial connection
    });
    console.log(`Log: MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Don't exit immediately so nodemon can keep trying when you fix the .env
  }
};

export default connectDB;