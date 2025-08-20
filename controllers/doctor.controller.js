import Doctor from "../models/doctor.model.js";
import Institution from "../models/institution.model.js";
import bcrypt from "bcryptjs";

// Get all doctors for a specific institution
export const getDoctors = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      specialization,
      search,
      institutionIds,
    } = req.query;

    const query = {};
    if (specialization) query.specialization = specialization;
    if (institutionIds) query.institutionIds = institutionIds;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { specialization: { $regex: search, $options: "i" } },
      ];
    }

    const doctors = await Doctor.find(query)
      .populate("institutionIds", "name type")
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Doctor.countDocuments(query);

    res.status(200).json({
      success: true,
      data: doctors,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single doctor for a specific institution
export const getDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id)
      .select("-password")
      .populate("institutionIds", "name type");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

// Create new doctor for a specific institution
export const createDoctor = async (req, res, next) => {
  try {
    const { institutionIds, ...doctorData } = req.body;

    // Validate institution exists
    if (institutionIds) {
      const institution = await Institution.findById(institutionIds);
      if (!institution) {
        return res.status(404).json({
          success: false,
          message: "Institution not found",
        });
      }
    }

    // Hash password if provided
    if (doctorData.password) {
      const salt = await bcrypt.genSalt(10);
      doctorData.password = await bcrypt.hash(doctorData.password, salt);
    }

    const doctor = await Doctor.create({
      ...doctorData,
      institutionIds: institutionIds || req.user.institutionId,
    });

    const populatedDoctor = await Doctor.findById(doctor._id)
      .select("-password")
      .populate("institutionIds", "name type");

    res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: populatedDoctor,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { institutionIds, ...updateData } = req.body;

    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    let doctor;

    if (institutionIds) {
      doctor = await Doctor.findByIdAndUpdate(
        id,
        {
          $addToSet: { institutionIds: institutionIds }, // adds only if not already present
          ...updateData,
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      )
        .select("-password")
        .populate("institutionIds", "name type");
    } else {
      doctor = await Doctor.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      )
        .select("-password")
        .populate("institutionIds", "name type");
    }

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

// Delete doctor for a specific institution
export const deleteDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    await Doctor.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
