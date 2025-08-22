import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";
import Doctor from "../models/doctor.model.js";

const authorize = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);

    let user;

    // Check if it's a doctor or regular user based on token type
    if (decoded.type === "doctor") {
      user = await Doctor.findById(decoded.userId);
    } else {
      user = await User.findById(decoded.userId);
    }

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    // Add role property for doctors to maintain consistency
    if (decoded.type === "doctor") {
      user.role = "doctor";
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

export default authorize;
