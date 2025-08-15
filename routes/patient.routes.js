import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { requireInstitutionAdmin } from "../middlewares/role.middleware.js";
import {
  createPatient,
  deletePatient,
  getPatient,
  getPatients,
  updatePatient,
} from "../controllers/patient.controller.js";

const patientRouter = Router();

// All routes require authentication
patientRouter.use(authorize, requireInstitutionAdmin);

// Enhanced patient routes with proper security
patientRouter.get("/", getPatients);

patientRouter.get("/:id", getPatient);

patientRouter.post("/", createPatient);

patientRouter.put("/:id", updatePatient);

patientRouter.delete("/:id", deletePatient);

export default patientRouter;
