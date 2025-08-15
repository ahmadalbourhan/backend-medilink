import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { requireInstitutionAdmin } from "../middlewares/role.middleware.js";

import {
  getDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctor.controller.js";

const doctorRouter = Router();

doctorRouter.use(authorize, requireInstitutionAdmin);

// Global doctor routes
doctorRouter.get("/", getDoctors);
doctorRouter.get("/:id", getDoctor);
doctorRouter.post("/", createDoctor);
doctorRouter.put("/:id", updateDoctor);
doctorRouter.delete("/:id", deleteDoctor);

export default doctorRouter;
