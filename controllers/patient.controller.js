import Patient from "../models/patient.model.js";
import mongoose from "mongoose";

// Get all patients - accessible by all institution admins
export const getPatients = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, institutionFilter } = req.query;

    let filter = {};

    // Super admin can see all patients
    // Institution admin can see all patients but might want to filter by institution
    if (req.user.role === "admin_institutions" && institutionFilter === "own") {
      filter.institutionId = req.user.institutionId;
    }

    // Search functionality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { patientId: { $regex: search, $options: "i" } },
        { "contact.email": { $regex: search, $options: "i" } },
        { "contact.phone": { $regex: search, $options: "i" } },
      ];
    }

    const patients = await Patient.find(filter)
      .populate("updatedBy", "name email")
      .populate("institutionId", "name type")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ updatedAt: -1 });

    const total = await Patient.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: patients.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: patients,
    });
  } catch (error) {
    next(error);
  }
};

// Get single patient - accessible by all institution admins
export const getPatient = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID",
      });
    }

    const patient = await Patient.findById(id)
      .populate("updatedBy", "name email")
      .populate("institutionId", "name type contact");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // All institution admins can view any patient
    // This enables shared healthcare records

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

// Create new patient
export const createPatient = async (req, res, next) => {
  try {
    const patientData = {
      ...req.body,
      updatedBy: req.user._id,
      // Always associate with the creating user's institution
      institutionId: req.user.institutionId || req.body.institutionId,
    };

    // Generate unique patient ID if not provided
    if (!patientData.patientId) {
      const lastPatient = await Patient.findOne().sort({ createdAt: -1 });
      const lastId = lastPatient?.patientId || "P000000";
      const numericPart = parseInt(lastId.substring(1)) + 1;
      patientData.patientId = "P" + numericPart.toString().padStart(6, "0");
    }

    // Handle pregnancy field for female patients
    if (patientData.gender === "female") {
      patientData.isPregnant = req.body.isPregnant || false;
    }

    const patient = new Patient(patientData);
    await patient.save();

    await patient.populate([
      { path: "updatedBy", select: "name email" },
      { path: "institutionId", select: "name type contact" },
    ]);

    res.status(201).json({
      success: true,
      message: "Patient created successfully",
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

// Update patient - any institution admin can update
export const updatePatient = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID",
      });
    }

    const patient = await Patient.findById(id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const updateData = {
      ...req.body,
      updatedBy: req.user._id,
      updatedAt: new Date(),
    };

    // Handle pregnancy field for female patients
    if (
      updateData.gender === "female" &&
      req.body.hasOwnProperty("isPregnant")
    ) {
      updateData.isPregnant = req.body.isPregnant;
    } else if (updateData.gender === "male") {
      updateData.isPregnant = undefined;
    }

    const updatedPatient = await Patient.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate([
      { path: "updatedBy", select: "name email" },
      { path: "institutionId", select: "name type contact" },
    ]);

    res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      data: updatedPatient,
    });
  } catch (error) {
    next(error);
  }
};

// Delete patient - only allow if no medical records exist
export const deletePatient = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID",
      });
    }

    const patient = await Patient.findById(id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Check if patient has any medical records
    const MedicalRecord = (await import("../models/medicalRecord.model.js"))
      .default;
    const recordCount = await MedicalRecord.countDocuments({
      patientId: patient.patientId,
    });

    if (recordCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete patient with existing medical records",
      });
    }

    await Patient.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Emergency access override
export const getPatientEmergency = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { emergencyReason } = req.body;

    if (!emergencyReason) {
      return res.status(400).json({
        success: false,
        message: "Emergency reason is required",
      });
    }

    // Check if user has emergency override permission
    if (!req.user.permissions.includes("emergency_override")) {
      return res.status(403).json({
        success: false,
        message: "Emergency access not authorized",
      });
    }

    const patient = await Patient.findById(id)
      .populate("updatedBy", "name email")
      .populate("institutionId", "name type contact");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Log emergency access
    const AuditLog = (await import("../models/auditLog.model.js")).default;
    await AuditLog.create({
      userId: req.user._id,
      userEmail: req.user.email,
      action: "EMERGENCY_ACCESS_PATIENT",
      resource: req.originalUrl,
      method: req.method,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
      success: true,
      details: {
        patientId: patient.patientId,
        emergencyReason,
        overrideUsed: true,
      },
    });

    res.status(200).json({
      success: true,
      data: patient,
      emergency: {
        accessGranted: true,
        reason: emergencyReason,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};
