import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { requireInstitutionAdmin } from "../middlewares/role.middleware.js";

import {
  getMedicalRecords,
  getMedicalRecord,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  getPatientMedicalRecords,
} from "../controllers/medicalRecord.controller.js";

const medicalRecordRouter = Router();

// Public endpoint for patients to access their own records
medicalRecordRouter.get("/patient/:patientId", getPatientMedicalRecords);

// All other routes require authentication
medicalRecordRouter.use(authorize, requireInstitutionAdmin);

// Global medical records routes
medicalRecordRouter.get("/", getMedicalRecords);
medicalRecordRouter.get("/:id", getMedicalRecord);
medicalRecordRouter.post("/", createMedicalRecord);
medicalRecordRouter.put("/:id", updateMedicalRecord);
medicalRecordRouter.delete("/:id", deleteMedicalRecord);

export default medicalRecordRouter;
