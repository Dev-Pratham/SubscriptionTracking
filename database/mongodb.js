import mongoose from "mongoose";
import { DB_URL, NODE_ENV } from "../config/env.js";

if (!DB_URL) {
  throw new Error("Database URL is not defined in environment variables");
}

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log(`Connected to MongoDB in ${NODE_ENV} mode at ${DB_URL}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectToDatabase;
