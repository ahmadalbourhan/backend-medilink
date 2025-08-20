import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import Patient from "../models/patient.model.js";

const patientAuthorize = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded?.patientId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Ensure the token patient matches the requested patient
    if (req.params?.patientId && req.params.patientId !== decoded.patientId) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const patient = await Patient.findOne({
      patientId: decoded.patientId,
    }).select("-password");
    if (!patient)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    req.patient = patient;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized", error: error.message });
  }
};

export default patientAuthorize;
