import Customer from "../models/Customer.js";

// @desc    Get all customers for the logged-in user's ORG
// @route   GET /api/customers
export const getCustomers = async (req, res) => {
  // SAAS FILTER: Only find customers matching the user's organization
  const customers = await Customer.find({ organization: req.org });
  res.json({ success: true, data: customers });
};

// @desc    Create new customer
// @route   POST /api/customers
export const createCustomer = async (req, res) => {
  const { name, email, phone, company } = req.body;

  // SAAS LOGIC: Automatically attach the organization and creator ID
  const customer = await Customer.create({
    name,
    email,
    phone,
    company,
    organization: req.org, // Injected from middleware
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, data: customer });
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
export const deleteCustomer = async (req, res) => {
  // SAAS SECURITY: Ensure the customer belongs to the user's ORG before deleting
  const customer = await Customer.findOne({ 
    _id: req.params.id, 
    organization: req.org 
  });

  if (customer) {
    await customer.deleteOne();
    res.json({ message: "Customer removed" });
  } else {
    res.status(404).json({ message: "Customer not found in your organization" });
  }
};

// @desc    Get single customer by ID
// @route   GET /api/customers/:id
export const getCustomerById = async (req, res) => {
  try {
    // SAAS SECURITY: Find by ID AND ensure it belongs to the user's organization
    const customer = await Customer.findOne({ 
      _id: req.params.id, 
      organization: req.org 
    });

    if (customer) {
      res.json({ success: true, data: customer });
    } else {
      res.status(404).json({ message: "Customer not found in your organization" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};