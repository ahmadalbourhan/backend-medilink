// Any authenticated user
export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }
  next();
};

// Role-based authorization middleware
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }

    next();
  };
};

// Admin only middleware
export const requireAdmin = requireRole(["admin"]);

// Institution admin middleware
export const requireInstitutionAdmin = requireRole(["admin_institutions"]);

// Both admin and institution admin can access
export const requireAdminOrInstitution = requireRole([
  "admin",
  "admin_institutions",
  "doctor",
]);
