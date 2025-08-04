// Role-based authorization middleware
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Check if user has specific permission
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Check if user belongs to the institution
export const requireInstitutionAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const institutionId = req.params.institutionId;

  // Admin can access any institution
  if (req.user.role === 'admin') {
    return next();
  }

  // Institution users can only access their own institution
  if (req.user.institutionId && req.user.institutionId.toString() === institutionId) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied to this institution'
  });
};

// Admin only middleware
export const requireAdmin = requireRole(['admin']);

// Institution admin middleware
export const requireInstitutionAdmin = requireRole(['admin', 'admin_institutions']);

// Medical staff middleware
export const requireMedicalStaff = requireRole(['admin', 'admin_institutions', 'doctor', 'nurse']);

// Any authenticated user
export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  next();
}; 