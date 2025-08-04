import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { requireAdmin, requirePermission } from "../middlewares/role.middleware.js";

// Import admin controllers
import {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
} from "../controllers/admin/role.controller.js";

import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/admin/user.controller.js";

const adminRouter = Router();

// All admin routes require admin role
adminRouter.use(authorize, requireAdmin);

// Role management
adminRouter.get("/roles", getRoles);
adminRouter.get("/roles/:id", getRole);
adminRouter.post("/roles", createRole);
adminRouter.put("/roles/:id", updateRole);
adminRouter.delete("/roles/:id", deleteRole);

// User management
adminRouter.get("/users", getUsers);
adminRouter.get("/users/:id", getUser);
adminRouter.post("/users", createUser);
adminRouter.put("/users/:id", updateUser);
adminRouter.delete("/users/:id", deleteUser);

// Institution management (admin can manage all institutions)
adminRouter.get("/institutions", (req, res) => {
  res.json({ message: "Admin institutions management" });
});

// System statistics
adminRouter.get("/statistics", (req, res) => {
  res.json({ message: "System statistics" });
});

export default adminRouter; 