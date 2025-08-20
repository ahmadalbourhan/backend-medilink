import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Patient from "../models/patient.model.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

// Initialize default admin on first run
export const initializeDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin", salt);

      await User.create({
        name: "System Administrator",
        email: "admin@medicalcv.com",
        password: hashedPassword,
        role: "admin",
      });

      console.log("Default admin created: admin@medicalcv.com / admin");
    }
  } catch (error) {
    console.error("Error creating default admin:", error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          institutionId: user.institutionId,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signInPatientId = async (req, res, next) => {
  try {
    const { patientId, password } = req.body;

    const patient = await Patient.findOne({ patientId });

    if (!patient) {
      const error = new Error("Patient not found");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, patient.password);

    if (!isPasswordValid) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { id: patient._id, patientId: patient.patientId },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Optionally track last login (field exists in schema)
    patient.lastLogin = new Date();
    await patient.save();

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        patient: {
          _id: patient._id,
          patientId: patient.patientId,
          name: patient.name,
          email: patient.contact.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    // This endpoint can be used for logging purposes
    res.status(200).json({
      success: true,
      message: "User signed out successfully",
    });
  } catch (error) {
    next(error);
  }
};
