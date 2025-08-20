import { Router } from "express";

import {
  signIn,
  signOut,
  signInPatientId,
} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/sign-in", signIn);
authRouter.post("/sign-out", signOut);
authRouter.post("/patient/sign-in", signInPatientId);

export default authRouter;
