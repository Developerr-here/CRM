import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * FIXED PATHING:
 * backend/src/utils/resetDb.js  -> __dirname
 * backend/src/                  -> ../
 * backend/                      -> ../../ (.env lives here)
 */
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import Lead from '../models/Lead.js';
import Customer from '../models/Customer.js';
import Task from '../models/Task.js';

const resetDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      console.error("❌ ERROR: MONGO_URI is undefined.");
      console.log("Current __dirname:", __dirname);
      console.log("Looking for .env at:", path.resolve(__dirname, '../../.env'));
      process.exit(1);
    }

    console.log("📡 Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("✅ Connected. Starting wipe...");

    const collections = [
      { model: Lead, name: 'Leads' },
      { model: Customer, name: 'Customers' },
      { model: Task, name: 'Tasks' }
    ];
    
    for (const item of collections) {
      const result = await item.model.deleteMany({});
      console.log(`🗑️  Removed ${result.deletedCount} from ${item.name}`);
    }

    console.log("✨ Database is now fresh.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Reset Error:", error.message);
    process.exit(1);
  }
};

resetDatabase();

