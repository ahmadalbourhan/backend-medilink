import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/role.middleware.js";

import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/admin/user.controller.js";

import {
  createInstitution,
  deleteInstitution,
  editInstitution,
  getInstitution,
  getInstitutions,
} from "../controllers/admin/institution.controller.js";

const adminRouter = Router();

// All admin routes require admin role
adminRouter.use(authorize, requireAdmin);

// Institution management
adminRouter.get("/institutions", getInstitutions);
adminRouter.get("/institutions/:id", getInstitution);
adminRouter.post("/institutions", createInstitution);
adminRouter.put("/institutions/:id", editInstitution);
adminRouter.delete("/institutions/:id", deleteInstitution);

// User management
adminRouter.get("/users", getUsers);
adminRouter.get("/users/:id", getUser);
adminRouter.post("/users", createUser);
adminRouter.put("/users/:id", updateUser);
adminRouter.delete("/users/:id", deleteUser);

export default adminRouter;
