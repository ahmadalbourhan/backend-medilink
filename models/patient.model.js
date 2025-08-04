import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  patientId: { type: String, required: true, unique: true },
  name: {
    type: String,
    required: [true, "User Name is required"],
    trim: true,
    minLength: 2,
    maxLength: 50,
  },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ["male", "female"], required: true },
  bloodType: {
    type: String,
    enum: ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"],
  },
  contact: {
    phone: String,
    email: String,
    address: String,
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String,
  },
  allergies: String, 
  insuranceInfo: {
    type: {
      type: String,
      enum: ["government", "military", "private", "employer"],
    },
    provider: String,
    policyNumber: String,
  },
  institutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institution",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
