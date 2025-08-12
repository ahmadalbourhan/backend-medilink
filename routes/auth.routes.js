import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/role.middleware.js";

import { signIn, signOut } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/admin/sign-in", signIn);
authRouter.post("/sign-in", authorize, requireAdmin, signIn);
authRouter.post("/sign-out", signOut);

export default authRouter;
