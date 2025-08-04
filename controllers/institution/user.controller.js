import User from '../../models/user.model.js';

// Get all users for a specific institution
export const getInstitutionUsers = async (req, res, next) => {
  try {
    const { institutionId } = req.params;
    const { page = 1, limit = 10, role, search } = req.query;
    
    const query = { institutionId };
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .populate('createdBy', 'name email')
      .select('-password')
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
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single user for a specific institution
export const getInstitutionUser = async (req, res, next) => {
  try {
    const { institutionId, id } = req.params;
    
    const user = await User.findOne({ _id: id, institutionId })
      .populate('createdBy', 'name email')
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found in this institution'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Create new user for a specific institution
export const createInstitutionUser = async (req, res, next) => {
  try {
    const { institutionId } = req.params;
    const { name, email, password, role, permissions } = req.body;

    const bcrypt = await import('bcryptjs');
    const salt = await bcrypt.default.genSalt(10);
    const hashedPassword = await bcrypt.default.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      institutionId,
      permissions: permissions || [],
      createdBy: req.user._id
    };

    const user = await User.create(userData);

    const populatedUser = await User.findById(user._id)
      .populate('createdBy', 'name email')
      .select('-password');

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: populatedUser
    });
  } catch (error) {
    next(error);
  }
};

// Update user for a specific institution
export const updateInstitutionUser = async (req, res, next) => {
  try {
    const { institutionId, id } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    // Hash password if provided
    if (updateData.password) {
      const bcrypt = await import('bcryptjs');
      const salt = await bcrypt.default.genSalt(10);
      updateData.password = await bcrypt.default.hash(updateData.password, salt);
    }

    const user = await User.findOneAndUpdate(
      { _id: id, institutionId },
      updateData,
      { new: true, runValidators: true }
    )
    .populate('createdBy', 'name email')
    .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found in this institution'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Delete user for a specific institution
export const deleteInstitutionUser = async (req, res, next) => {
  try {
    const { institutionId, id } = req.params;
    
    const user = await User.findOne({ _id: id, institutionId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found in this institution'
      });
    }

    // Prevent deleting admin users
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete admin users'
      });
    }

    await User.findOneAndDelete({ _id: id, institutionId });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}; 