import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    phone: String,
    address: String,
    institutionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Institution",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
