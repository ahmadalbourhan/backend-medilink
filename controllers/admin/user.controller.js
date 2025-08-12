import User from "../../models/user.model.js";
import Institution from "../../models/institution.model.js";

// Get all users (admin only)
export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, institutionId, search } = req.query;

    const query = {};
    if (role) query.role = role;
    if (institutionId) query.institutionId = institutionId;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .populate("institutionId", "name type")
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
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

// Get single user
export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .populate("institutionId", "name type")
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Create new user (admin only)
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, institutionId, permissions } =
      req.body;

    // Validate institution if provided
    if (institutionId) {
      const institution = await Institution.findById(institutionId);
      if (!institution) {
        return res.status(404).json({
          success: false,
          message: "Institution not found",
        });
      }
    }

    const bcrypt = await import("bcryptjs");
    const salt = await bcrypt.default.genSalt(10);
    const hashedPassword = await bcrypt.default.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      institutionId,
      permissions: permissions || [],
    };

    const user = await User.create(userData);

    const populatedUser = await User.findById(user._id)
      .populate("institutionId", "name type")
      .select("-password");

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: populatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// Update user
export const updateUser = async (req, res, next) => {
  res.send("Update user functionality is not implemented yet.");
};

// Delete user
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent deleting admin users
    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete admin users",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
