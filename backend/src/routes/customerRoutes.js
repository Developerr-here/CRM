import express from 'express';
const router = express.Router();
import { 
  getCustomers, 
  createCustomer, 
  getCustomerById, // This matches the export above
  deleteCustomer 
} from '../controllers/customerController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/')
  .get(protect, getCustomers)
  .post(protect, createCustomer);

router.route('/:id')
  .get(protect, getCustomerById) // This uses the function causing the error
  .delete(protect, deleteCustomer);

export default router;
// import express from "express";
// import {
//   createCustomer,
//   getCustomers,
//   getCustomerById,
//   updateCustomer,
//   deleteCustomer,
// } from "../controllers/customerController.js";
// import { protect } from "../middleware/authMiddleware.js";
// import { authorize } from "../middleware/roleMiddleware.js";

// const router = express.Router();

// // All customer routes require being logged in
// router.use(protect);

// router.route("/")
//   .post(createCustomer)
//   .get(getCustomers);

// router.route("/:id")
//   .get(getCustomerById)
//   .put(updateCustomer)
//   .delete(authorize("admin", "manager"), deleteCustomer);

// export default router;