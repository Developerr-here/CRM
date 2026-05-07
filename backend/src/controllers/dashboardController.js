// @desc    Get SaaS Dashboard Stats
// @route   GET /api/dashboard/stats
export const getDashboardStats = async (req, res) => {
 try {
   // 1. Count only THIS organization's customers
   const totalCustomers = await Customer.countDocuments({ organization: req.org });
 
   // 2. Sum only THIS organization's active lead values
   const pipelineData = await Lead.aggregate([
     { $match: { organization: req.org, status: { $ne: 'lost' } } },
     { $group: { _id: null, totalValue: { $sum: "$value" } } }
   ]);
 
   res.json({
     success: true,
     stats: {
       customers: totalCustomers,
       pipelineValue: pipelineData[0]?.totalValue || 0,
       organizationName: req.org
     }
   });
 } catch (error) {

  res.status(500).json({ message: "Error calculating stats", error: error.message });
  
 }
};