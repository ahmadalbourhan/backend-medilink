import MedicalRecord from "../models/medicalRecord.model.js";
import Patient from "../models/patient.model.js";
import Doctor from "../models/doctor.model.js";
import mongoose from "mongoose";

// Get all medical records - accessible by all institution admins
export const getMedicalRecords = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      patientId,
      doctorId,
      institutionFilter,
    } = req.query;

    let filter = {};

    // Filter options
    if (patientId) filter.patientId = patientId;
    if (doctorId) filter.doctorId = doctorId;

    // // Institution admins can filter to see only their institution's records
    // if (req.user.role === "admin_institutions" && institutionFilter === "own") {
    //   filter.institutionId = req.user.institutionId;
    // }

    const medicalRecords = await MedicalRecord.find(filter)
      .populate("doctorId", "name specialization")
      .populate("createdBy", "name")
      .populate("updatedBy", "name")
      // .populate({
      //   // path: "institutionId",
      //   select: "name type contact",
      // })
      .populate("patient", "name dateOfBirth gender")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ "visitInfo.date": -1 });

    const total = await MedicalRecord.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: medicalRecords.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: medicalRecords,
    });
  } catch (error) {
    next(error);
  }
};

// Get medical records for a specific patient - PUBLIC ACCESS
export const getPatientMedicalRecords = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    // Verify patient exists
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const medicalRecords = await MedicalRecord.find({ patientId })
      .populate("doctorId", "name specialization")
      .populate({
        path: "institutionId",
        select: "name type contact",
      })
      .populate("patient", "name dateOfBirth gender")
      .sort({ "visitInfo.date": -1 });

    res.status(200).json({
      success: true,
      count: medicalRecords.length,
      patient: {
        patientId: patient.patientId,
        name: patient.name,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
      },
      data: medicalRecords,
    });
  } catch (error) {
    next(error);
  }
};

// Create medical record for a specific patient
export const createPatientMedicalRecord = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    // Verify patient exists
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const medicalRecordData = {
      ...req.body,
      patientId,
      institutionId: req.user.institutionId,
      createdBy: req.user.institutionId,
      updatedBy: req.user.institutionId,
    };

    const medicalRecord = new MedicalRecord(medicalRecordData);
    await medicalRecord.save();

    await medicalRecord.populate([
      { path: "doctorId", select: "name specialization" },
      { path: "institutionId", select: "name type" },
    ]);

    res.status(201).json({
      success: true,
      message: "Medical record created successfully",
      data: medicalRecord,
    });
  } catch (error) {
    next(error);
  }
};

// Get single medical record
export const getMedicalRecord = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid medical record ID",
      });
    }

    const medicalRecord = await MedicalRecord.findById(id)
      .populate("doctorId", "name specialization licenseNumber")
      .populate({
        path: "institutionId",
        select: "name type contact",
      })
      .populate("createdBy", "name")
      .populate("updatedBy", "name");

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: "Medical record not found",
      });
    }

    res.status(200).json({
      success: true,
      data: medicalRecord,
    });
  } catch (error) {
    next(error);
  }
};

// Create medical record
export const createMedicalRecord = async (req, res, next) => {
  try {
    const medicalRecordData = {
      ...req.body,
      institutionId: req.user.institutionId,
      createdBy: req.user.institutionId,
      updatedBy: req.user.institutionId,
    };

    console.log("Creating medical record:", medicalRecordData);
    // Verify patient exists
    const patient = await Patient.findOne({
      patientId: medicalRecordData.patientId,
    });
    console.log("Patient ID:", medicalRecordData.patientId);
    console.log("Patient found:", patient ? patient.patientId : "Not found");
    console.log("Found patient:", patient);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Verify doctor exists
    const doctor = await Doctor.findById(medicalRecordData.doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const medicalRecord = new MedicalRecord(medicalRecordData);
    await medicalRecord.save();

    await medicalRecord.populate([
      { path: "doctorId", select: "name specialization" },
      { path: "institutionId", select: "name type" },
    ]);

    res.status(201).json({
      success: true,
      message: "Medical record created successfully",
      data: medicalRecord,
    });
  } catch (error) {
    next(error);
  }
};

// Update medical record
export const updateMedicalRecord = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid medical record ID",
      });
    }

    const medicalRecord = await MedicalRecord.findById(id);

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: "Medical record not found",
      });
    }

    const updateData = {
      ...req.body,
      updatedBy: req.user.institutionId,
      updatedAt: new Date(),
    };

    const updatedRecord = await MedicalRecord.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate([
      { path: "doctorId", select: "name specialization" },
      { path: "institutionId", select: "name type" },
    ]);

    res.status(200).json({
      success: true,
      message: "Medical record updated successfully",
      data: updatedRecord,
    });
  } catch (error) {
    next(error);
  }
};

// Delete medical record
export const deleteMedicalRecord = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid medical record ID",
      });
    }

    const medicalRecord = await MedicalRecord.findById(id);

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: "Medical record not found",
      });
    }

    await MedicalRecord.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Medical record deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
