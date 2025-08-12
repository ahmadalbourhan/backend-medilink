import User from "../models/user.model.js";
import Institution from "../models/institution.model.js";

// Get all institutions
export const getInstitutions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type, search } = req.query;

    const query = {};
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { "contact.address": { $regex: search, $options: "i" } },
      ];
    }

    const institutions = await Institution.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Institution.countDocuments(query);

    res.status(200).json({
      success: true,
      data: institutions,
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

// Get single institution
export const getInstitution = async (req, res, next) => {
  try {
    const { id } = req.params;

    const institution = await Institution.findById(id);

    if (!institution) {
      return res.status(404).json({
        success: false,
        message: "Institution not found",
      });
    }

    res.status(200).json({
      success: true,
      data: institution,
    });
  } catch (error) {
    next(error);
  }
};

// Create new institution
export const createInstitution = async (req, res, next) => {
  try {
    const institutionData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const institution = await Institution.create(institutionData);

    res.status(201).json({
      success: true,
      message: "Institution created successfully",
      data: institution,
    });
  } catch (error) {
    next(error);
  }
};

// Update institution
export const editInstitution = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date(),
    };

    const institution = await Institution.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!institution) {
      return res.status(404).json({
        success: false,
        message: "Institution not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Institution updated successfully",
      data: institution,
    });
  } catch (error) {
    next(error);
  }
};

// // Delete institution
// export const deleteInstitution = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const institution = await Institution.findById(id);

//     if (!institution) {
//       return res.status(404).json({
//         success: false,
//         message: "Institution not found",
//       });
//     }

//     await Institution.findByIdAndDelete(id);

//     res.status(200).json({
//       success: true,
//       message: "Institution deleted successfully",
//     });
//   } catch (error) {
//     next(error);
//   }
// };
export const deleteInstitution = async (req, res, next) => {
  try {
    const { id } = req.params;

    const institution = await Institution.findById(id);

    if (!institution) {
      return res.status(404).json({
        success: false,
        message: "Institution not found",
      });
    }

    // Delete all users related to this institution
    await User.deleteMany({ institutionId: id });

    // Delete the institution itself
    await Institution.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Institution and related users deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
