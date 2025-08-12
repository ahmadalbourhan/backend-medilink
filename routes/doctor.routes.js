// routes/doctor.routes.js - Global Doctor Routes
import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { requirePermission } from "../middlewares/role.middleware.js";

import {
  getDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctor.controller.js";

const doctorRouter = Router();

doctorRouter.use(authorize);

// Global doctor routes
doctorRouter.get("/", requirePermission("manage_doctors"), getDoctors);
doctorRouter.get("/:id", requirePermission("manage_doctors"), getDoctor);
doctorRouter.post("/", requirePermission("manage_doctors"), createDoctor);
doctorRouter.put("/:id", requirePermission("manage_doctors"), updateDoctor);
doctorRouter.delete("/:id", requirePermission("manage_doctors"), deleteDoctor);

export default doctorRouter;
