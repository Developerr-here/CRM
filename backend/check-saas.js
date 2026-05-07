import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Customer from './src/models/Customer.js';

dotenv.config();

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to Database\n");

    // 1. Check Users
    const users = await User.find({});
    console.log("--- USERS IN DB ---");
    users.forEach(u => {
      console.log(`Name: ${u.name} | Org: ${u.organization} | Role: ${u.role}`);
    });

    // 2. Check Customers
    const customers = await Customer.find({});
    console.log("\n--- CUSTOMERS IN DB ---");
    if (customers.length === 0) console.log("No customers found yet.");
    customers.forEach(c => {
      console.log(`Customer: ${c.name} | Belongs to Org: ${c.organization}`);
    });

    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

checkData();