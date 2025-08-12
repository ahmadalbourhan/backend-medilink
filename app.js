// Updated app.js with new route structure
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { PORT } from "./config/env.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import { initializeDefaultAdmin } from "./controllers/auth.controller.js";

// Import all routers
import authRouter from "./routes/auth.routes.js";
import adminRouter from "./routes/admin.routes.js";
import patientRouter from "./routes/patient.routes.js";
import doctorRouter from "./routes/doctor.routes.js";
import medicalRecordRouter from "./routes/medicalRecord.routes.js";

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));

// API Routes - New Structure
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/patients", patientRouter);
app.use("/api/v1/doctors", doctorRouter);
app.use("/api/v1/medical-records", medicalRecordRouter);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Medical CV System API!",
    version: "1.0.0",
    status: "running",
    features: ["Shared patient records across institutions"],
    endpoints: {
      auth: "/api/v1/auth",
      admin: "/api/v1/admin",
      patients: "/api/v1/patients",
      doctors: "/api/v1/doctors",
      medicalRecords: "/api/v1/medical-records",
      patientRecords: "/api/v1/patient-records/:patientId/medical-records",
      publicPatientAccess: "/api/v1/medical-records/patient/:patientId",
    },
  });
});

// Error handling middleware
app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(
    `Medical CV System API v1.0 is running on http://localhost:${PORT}`
  );
  await connectToDatabase();
  await initializeDefaultAdmin();
});

export default app;
