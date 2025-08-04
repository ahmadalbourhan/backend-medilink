import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { requireAdmin, requireInstitutionAdmin, requireMedicalStaff, requirePermission } from "../middlewares/role.middleware.js";
import {
  getInstitutions,
  getInstitution,
  createInstitution,
  editInstitution,
  deleteInstitution,
} from "../controllers/institution.controller.js";

// Import nested controllers
import {
  getInstitutionPatients,
  getInstitutionPatient,
  createInstitutionPatient,
  updateInstitutionPatient,
  deleteInstitutionPatient,
} from "../controllers/institution/patient.controller.js";

import {
  getInstitutionDoctors,
  getInstitutionDoctor,
  createInstitutionDoctor,
  updateInstitutionDoctor,
  deleteInstitutionDoctor,
} from "../controllers/institution/doctor.controller.js";

import {
  getInstitutionMedicalRecords,
  getInstitutionMedicalRecord,
  createInstitutionMedicalRecord,
  updateInstitutionMedicalRecord,
  deleteInstitutionMedicalRecord,
} from "../controllers/institution/medicalRecord.controller.js";

import {
  getInstitutionUsers,
  getInstitutionUser,
  createInstitutionUser,
  updateInstitutionUser,
  deleteInstitutionUser,
} from "../controllers/institution/user.controller.js";

// Import public patient access controller
import { getPatientMedicalRecords } from "../controllers/institution/medicalRecord.controller.js";

const institutionRouter = Router();

// Admin routes for institution management
institutionRouter.get("/", getInstitutions);
institutionRouter.get("/:id", getInstitution);
institutionRouter.post("/", authorize, requireAdmin, createInstitution);
institutionRouter.put("/:id", authorize, requireAdmin, editInstitution);
institutionRouter.delete("/:id", authorize, requireAdmin, deleteInstitution);

// Public patient access route (for React Native app)
institutionRouter.get("/medical-records/patient/:patientId", getPatientMedicalRecords);

// Nested routes for institution-specific resources
// All nested routes require authentication and institution access
institutionRouter.use("/:institutionId", authorize, requireInstitutionAdmin);

// Institution Users (admin_institutions can manage users)
institutionRouter.get("/:institutionId/users", requireInstitutionAdmin, getInstitutionUsers);
institutionRouter.get("/:institutionId/users/:id", requireInstitutionAdmin, getInstitutionUser);
institutionRouter.post("/:institutionId/users", requireInstitutionAdmin, createInstitutionUser);
institutionRouter.put("/:institutionId/users/:id", requireInstitutionAdmin, updateInstitutionUser);
institutionRouter.delete("/:institutionId/users/:id", requireInstitutionAdmin, deleteInstitutionUser);

// Institution Patients (medical staff can manage patients)
institutionRouter.get("/:institutionId/patients", requireMedicalStaff, getInstitutionPatients);
institutionRouter.get("/:institutionId/patients/:id", requireMedicalStaff, getInstitutionPatient);
institutionRouter.post("/:institutionId/patients", requireMedicalStaff, createInstitutionPatient);
institutionRouter.put("/:institutionId/patients/:id", requireMedicalStaff, updateInstitutionPatient);
institutionRouter.delete("/:institutionId/patients/:id", requireMedicalStaff, deleteInstitutionPatient);

// Institution Doctors (medical staff can manage doctors)
institutionRouter.get("/:institutionId/doctors", requireMedicalStaff, getInstitutionDoctors);
institutionRouter.get("/:institutionId/doctors/:id", requireMedicalStaff, getInstitutionDoctor);
institutionRouter.post("/:institutionId/doctors", requireMedicalStaff, createInstitutionDoctor);
institutionRouter.put("/:institutionId/doctors/:id", requireMedicalStaff, updateInstitutionDoctor);
institutionRouter.delete("/:institutionId/doctors/:id", requireMedicalStaff, deleteInstitutionDoctor);

// Institution Medical Records (medical staff can manage records)
institutionRouter.get("/:institutionId/medical-records", requireMedicalStaff, getInstitutionMedicalRecords);
institutionRouter.get("/:institutionId/medical-records/:id", requireMedicalStaff, getInstitutionMedicalRecord);
institutionRouter.post("/:institutionId/medical-records", requireMedicalStaff, createInstitutionMedicalRecord);
institutionRouter.put("/:institutionId/medical-records/:id", requireMedicalStaff, updateInstitutionMedicalRecord);
institutionRouter.delete("/:institutionId/medical-records/:id", requireMedicalStaff, deleteInstitutionMedicalRecord);

export default institutionRouter;
