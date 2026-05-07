import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  organization: { 
  type: String, 
  required: true, 
  index: true 
},
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Customer", 
    required: true 
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["new", "contacted", "negotiation", "won", "lost"], 
    default: "new" 
  },
  value: { type: Number, default: 0 }, // Expected deal value
  source: { type: String }, // e.g., Website, LinkedIn, Referral
  notes: { type: String },
  // AI Insight Fields
  aiScore: { 
    type: Number, 
    min: 0, 
    max: 100, 
    default: 0 
  },
  aiSummary: { 
    type: String, 
    default: "Pending analysis..." 
  },
  lastAiUpdate: { 
    type: Date 
  }
}, { timestamps: true });

const Lead = mongoose.model("Lead", leadSchema);
export default Lead;