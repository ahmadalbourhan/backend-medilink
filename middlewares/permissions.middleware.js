// Enhanced permission middleware
export const requireCrossInstitutionAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  // Super admin has full access
  if (req.user.role === "admin") {
    return next();
  }

  // Institution admins need explicit cross-institution permission
  if (!req.user.permissions.includes("cross_institution_access")) {
    return res.status(403).json({
      success: false,
      message: "Cross-institution access not permitted",
    });
  }

  next();
};

export const requireDataModificationRights = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  // For POST, PUT, DELETE operations, check if user can modify data
  const modifyingOperations = ["POST", "PUT", "DELETE"];

  if (modifyingOperations.includes(req.method)) {
    // Super admin can modify anything
    if (req.user.role === "admin") {
      return next();
    }

    // Institution admins can only modify their own institution's data for creation
    // For updates, they can modify if they have cross_institution_modify permission
    if (req.method === "POST") {
      // Creating new records - must be for their institution
      return next(); // Will be handled in controller
    } else {
      // Updating/deleting - need special permission for cross-institution
      if (!req.user.permissions.includes("cross_institution_modify")) {
        return res.status(403).json({
          success: false,
          message: "Cross-institution modification not permitted",
        });
      }
    }
  }

  next();
};
