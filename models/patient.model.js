import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    dateOfBirth: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          return v <= new Date();
        },
        message: "Date of birth cannot be in the future",
      },
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    // Add isPregnant field for female patients
    isPregnant: {
      type: Boolean,
      default: false,
      validate: {
        validator: function (v) {
          // Only allow isPregnant to be true for female patients
          if (v === true && this.gender !== "female") {
            return false;
          }
          return true;
        },
        message: "Only female patients can be marked as pregnant",
      },
    },
    bloodType: {
      type: String,
      enum: ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"],
    },
    contact: {
      phone: {
        type: String,
        validate: {
          validator: function (v) {
            return !v || /^[\+]?[\d\s\-\(\)]+$/.test(v);
          },
          message: "Invalid phone number format",
        },
      },
      email: {
        type: String,
        validate: {
          validator: function (v) {
            return !v || /\S+@\S+\.\S+/.test(v);
          },
          message: "Invalid email format",
        },
      },
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
    // Add institutionId to link patient to institution
    institutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institution",
      // Not required for super admin created patients
      required: function () {
        return this.updatedBy && this.updatedBy.role !== "admin";
      },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    // Add virtual for age calculation
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for age calculation
patientSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
});

// Pre-save middleware to handle isPregnant field
patientSchema.pre("save", function (next) {
  if (this.gender === "male") {
    this.isPregnant = undefined;
  } else if (this.gender === "female" && this.isPregnant === undefined) {
    this.isPregnant = false;
  }
  next();
});

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
