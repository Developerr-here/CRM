import express from "express";
import {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
} from "../controllers/leadController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .post(createLead)
  .get(getLeads);

router.route("/:id")
  .put(updateLead)
  .delete(authorize("admin", "manager"), deleteLead);

export default router;