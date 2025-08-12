import mongoose from "mongoose";

const PrescriptionSchema = new mongoose.Schema(
  {
    medicationName: { type: String, required: true },
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String,
  },
  { _id: false }
);

const LabResultSchema = new mongoose.Schema(
  {
    testName: { type: String, required: true },
    result: String,
    referenceRange: String,
    status: { type: String, enum: ["normal", "abnormal", "critical"] },
  },
  { _id: false }
);

const AttachmentSchema = new mongoose.Schema(
  {
    fileName: String,
    fileUrl: String,
    fileType: { type: String, enum: ["pdf", "jpg", "png"] },
    description: String,
  },
  { _id: false }
);

const MedicalRecordSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  // add institution id if that needed
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },

  visitInfo: {
    type: {
      type: String,
      enum: [
        "consultation",
        "emergency",
        "follow-up",
        "surgery",
        "lab-test",
        "immunization",
      ],
      required: true,
    },
    date: { type: Date, required: true },
    admissionDate: Date,
    dischargeDate: Date,
    isEmergency: { type: Boolean, default: false },
  },

  clinicalData: {
    symptoms: String,
    diagnosis: String,
    treatment: String,
    notes: String,
  },

  prescriptions: [PrescriptionSchema],

  labResults: [LabResultSchema],

  attachments: [AttachmentSchema],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Institution" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Institution" },
});

export default mongoose.model("MedicalRecord", MedicalRecordSchema);
