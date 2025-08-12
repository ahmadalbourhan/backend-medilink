// routes/medicalRecord.routes.js - Global Medical Records Routes
import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { requirePermission } from "../middlewares/role.middleware.js";

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
medicalRecordRouter.use(authorize);

// Global medical records routes
medicalRecordRouter.get(
  "/",
  requirePermission("manage_medical_records"),
  getMedicalRecords
);
medicalRecordRouter.get(
  "/:id",
  requirePermission("manage_medical_records"),
  getMedicalRecord
);
medicalRecordRouter.post(
  "/",
  requirePermission("manage_medical_records"),
  createMedicalRecord
);
medicalRecordRouter.put(
  "/:id",
  requirePermission("manage_medical_records"),
  updateMedicalRecord
);
medicalRecordRouter.delete(
  "/:id",
  requirePermission("manage_medical_records"),
  deleteMedicalRecord
);

export default medicalRecordRouter;
