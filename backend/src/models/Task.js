import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  status: { 
    type: String, 
    enum: ["pending", "in-progress", "completed"], 
    default: "pending" 
  },
  priority: { 
    type: String, 
    enum: ["low", "medium", "high"], 
    default: "medium" 
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  relatedLead: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Lead" 
  },
  organization: { 
  type: String, 
  required: true, 
  index: true 
},
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);
export default Task;