import mongoose from "mongoose";

const customerSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    company: { type: String }, // This is the customer's company (e.g., Google)
    
    // THE SAAS KEY: This is the OWNER'S organization (e.g., Nexus Tech)
    organization: { 
      type: String, 
      required: true, 
      index: true // Indexing makes filtering super fast
    },
    
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;