import Task from "../models/Task.js";

// @desc    Get all tasks for the User's Org
// @route   GET /api/tasks
export const getTasks = async (req, res) => {
  // SAAS FILTER: Only find tasks belonging to the user's company
  const tasks = await Task.find({ organization: req.org })
    .populate({
      path: 'relatedLead',
      populate: { path: 'customer' } // Deep populate to show customer name
    })
    .sort({ dueDate: 1 });

  res.json({ success: true, data: tasks });
};

// @desc    Create new task
// @route   POST /api/tasks
export const createTask = async (req, res) => {
  const task = await Task.create({
    ...req.body,
    assignedTo: req.body.assignedTo || req.user._id, // Assign to current user if unspecified
    organization: req.org, // Auto-attach the organization
    createdBy: req.user._id
  });

  res.status(201).json({ success: true, data: task });
};

// @desc    Update task (e.g., mark as completed)
// @route   PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  // SECURITY: Only update if the task belongs to the user's Org
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, organization: req.org },
    req.body,
    { new: true }
  );

  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json({ success: true, data: task });
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  // SECURITY: Only delete if the task belongs to the user's Org
  const task = await Task.findOneAndDelete({ 
    _id: req.params.id, 
    organization: req.org 
  });

  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json({ success: true, message: "Task removed" });
};