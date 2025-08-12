import Doctor from "../models/doctor.model.js";
import Institution from "../models/institution.model.js";

// Get all doctors for a specific institution
export const getDoctors = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      specialization,
      search,
      institutionId,
    } = req.query;

    const query = {};
    if (specialization) query.specialization = specialization;
    if (institutionId) query.institutionId = institutionId;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { specialization: { $regex: search, $options: "i" } },
      ];
    }

    const doctors = await Doctor.find(query)
      .populate("institutionId", "name type")
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

    const doctor = await Doctor.findById(id).populate(
      "institutionId",
      "name type"
    );

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
    const { institutionId, ...doctorData } = req.body;

    // Validate institution exists
    if (institutionId) {
      const institution = await Institution.findById(institutionId);
      if (!institution) {
        return res.status(404).json({
          success: false,
          message: "Institution not found",
        });
      }
    }

    const doctor = await Doctor.create({
      ...doctorData,
      institutionId: institutionId || req.user.institutionId,
    });

    const populatedDoctor = await Doctor.findById(doctor._id).populate(
      "institutionId",
      "name type"
    );

    res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: populatedDoctor,
    });
  } catch (error) {
    next(error);
  }
};

// Update doctor for a specific institution
export const updateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date(),
    };

    const doctor = await Doctor.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("institutionId", "name type");

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
