import Lead from "../models/Lead.js";
import { triggerAiAnalysis } from "../utils/aiWorkflows.js";

// @desc    Create new lead
// @route   POST /api/leads
export const createLead = async (req, res) => {
  const { customer, status, value, source, notes, assignedTo } = req.body;

  const lead = await Lead.create({
    customer,
    status,
    value,
    source,
    notes,
    assignedTo: assignedTo || req.user._id, // Assign to someone specific or the creator
    organization: req.org
  });
  triggerAiAnalysis(lead._id);

  res.status(201).json({ success: true, data: lead });
};

// @desc    Get all leads with details
// @route   GET /api/leads
export const getLeads = async (req, res) => {
  const leads = await Lead.find({ organization: req.org }).populate("customer");
  res.json({ success: true, data: leads });
};

// @desc    Update lead status or details
// @route   PUT /api/leads/:id
export const updateLead = async (req, res) => {
  // SECURITY: Find by ID AND Organization
  const lead = await Lead.findOneAndUpdate(
    { _id: req.params.id, organization: req.org }, 
    req.body, 
    { new: true, runValidators: true }
  );

  if (!lead) return res.status(404).json({ message: "Lead not found in your organization" });
  res.status(200).json({ success: true, data: lead });
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
export const deleteLead = async (req, res) => {
  // SECURITY: Delete by ID AND Organization
  const lead = await Lead.findOneAndDelete({ 
    _id: req.params.id, 
    organization: req.org 
  });

  if (!lead) return res.status(404).json({ message: "Lead not found in your organization" });
  res.status(200).json({ success: true, message: "Lead removed" });
};