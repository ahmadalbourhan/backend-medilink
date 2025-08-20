import Patient from "../models/patient.model.js";
import bcrypt from "bcryptjs";

/**
 * @desc   Create/Register a new patient
 * @route  POST /api/patients
 */
export const createPatient = async (req, res) => {
  try {
    const { password, contact, ...rest } = req.body;

    // Check if patient with same email exists
    if (contact?.email) {
      const existing = await Patient.findOne({
        "contact.email": contact.email,
      });
      if (existing) {
        return res
          .status(400)
          .json({ success: false, message: "Email already registered" });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const patient = new Patient({
      ...rest,
      contact,
      password: hashedPassword,
    });

    await patient.save();

    res.status(201).json({
      success: true,
      message: "Patient registered successfully",
      data: {
        _id: patient._id,
        patientId: patient.patientId, // auto-generated from model
        name: patient.name,
        gender: patient.gender,
        dateOfBirth: patient.dateOfBirth,
        contact: patient.contact,
        createdAt: patient.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc   Get all patients
 * @route  GET /api/patients
 */
export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().select("-password"); // exclude password
    res.json({ success: true, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc   Get single patient by ID
 * @route  GET /api/patients/:patientId
 * @param  {string} patientId - The unique patient ID
 */
export const getPatientById = async (req, res) => {
  try {
    // Search by patientId, not Mongo _id
    const patient = await Patient.findOne({
      patientId: req.params.patientId,
    }).select("-password");

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }

    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc   Update patient
 * @route  PUT /api/patients/:patientId
 */
export const updatePatient = async (req, res) => {
  try {
    const { password, patientId, ...updates } = req.body;

    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    const patient = await Patient.findOneAndUpdate(
      { patientId: req.params.patientId },
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }

    res.json({
      success: true,
      message: "Patient updated successfully",
      data: patient,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc   Delete patient
 * @route  DELETE /api/patients/:patientId
 */
export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findOneAndDelete({
      patientId: req.params.patientId,
    });

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }

    res.json({ success: true, message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
