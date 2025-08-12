import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import {
  requireInstitutionAdmin,
  requirePermission,
} from "../middlewares/role.middleware.js";
import {
  requireCrossInstitutionAccess,
  requireDataModificationRights,
} from "../middlewares/permissions.middleware.js";
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
patientRouter.get(
  "/",
  // requirePermission("manage_patients"),
  // requireCrossInstitutionAccess,
  getPatients
);

patientRouter.get(
  "/:id",
  // requirePermission("manage_patients"),
  // requireCrossInstitutionAccess,
  getPatient
);

patientRouter.post(
  "/",
  // requirePermission("manage_patients"),
  // requireDataModificationRights,
  createPatient
);

patientRouter.put(
  "/:id",
  // requirePermission("manage_patients"),
  // requireDataModificationRights,
  updatePatient
);

patientRouter.delete(
  "/:id",
  // requirePermission("manage_patients"),
  // requireDataModificationRights,
  deletePatient
);

export default patientRouter;
