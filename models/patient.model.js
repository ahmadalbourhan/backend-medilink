import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      unique: true,
    },
    password: { type: String, required: true, minlength: 6 },
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    isPregnant: { type: Boolean, default: false },
    bloodType: {
      type: String,
      enum: ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"],
    },
    contact: {
      phone: String,
      email: { type: String, unique: true },
      address: String,
    },
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },
    allergies: [String],
    insuranceInfo: {
      insuranceType: {
        type: String,
        enum: ["government", "military", "private", "employer"],
      },
      provider: String,
      policyNumber: String,
    },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

// Function to generate a unique patientId
async function generatePatientId() {
  let patientId;
  let exists = true;

  while (exists) {
    // Generate "P" + 9 random digits
    patientId = "P" + Math.floor(100000000 + Math.random() * 900000000);

    // Check if ID already exists in DB
    const existing = await mongoose.models.Patient.findOne({ patientId });
    if (!existing) exists = false;
  }

  return patientId;
}

// Pre-save hook to assign patientId if not already set
patientSchema.pre("save", async function (next) {
  if (!this.patientId) {
    this.patientId = await generatePatientId();
  }
  next();
});

// Note: Unique index on `patientId` is defined at the field level

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
