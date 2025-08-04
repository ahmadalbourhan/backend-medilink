import Role from '../../models/role.model.js';

// Get all roles
export const getRoles = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { displayName: { $regex: search, $options: 'i' } }
      ];
    }

    const roles = await Role.find(query)
      .populate('createdBy', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Role.countDocuments(query);

    res.status(200).json({
      success: true,
      data: roles,
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

// Get single role
export const getRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const role = await Role.findById(id)
      .populate('createdBy', 'name email');

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    res.status(200).json({
      success: true,
      data: role
    });
  } catch (error) {
    next(error);
  }
};

// Create new role
export const createRole = async (req, res, next) => {
  try {
    const roleData = {
      ...req.body,
      createdBy: req.user._id
    };

    const role = await Role.create(roleData);

    const populatedRole = await Role.findById(role._id)
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: populatedRole
    });
  } catch (error) {
    next(error);
  }
};

// Update role
export const updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    const role = await Role.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Role updated successfully',
      data: role
    });
  } catch (error) {
    next(error);
  }
};

// Delete role
export const deleteRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const role = await Role.findById(id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    if (role.isSystem) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete system roles'
      });
    }

    await Role.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}; 