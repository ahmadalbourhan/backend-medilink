import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { requireAdminOrInstitution } from "../middlewares/role.middleware.js";
import {
  createPatient,
  deletePatient,
  getPatientById,
  getAllPatients,
  updatePatient,
} from "../controllers/patient.controller.js";

const patientRouter = Router();

// All routes require authentication
patientRouter.use(authorize, requireAdminOrInstitution);

// Enhanced patient routes with proper security
patientRouter.get("/", getAllPatients);

patientRouter.get("/:patientId", getPatientById);

patientRouter.post("/", createPatient);

patientRouter.put("/:patientId", updatePatient);

patientRouter.delete("/:patientId", deletePatient);

export default patientRouter;
