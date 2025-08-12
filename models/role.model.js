import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    description: String,
    permissions: [
      {
        type: String,
        enum: [
          "manage_patients",
          "manage_doctors",
          "manage_medical_records",
          "manage_users",
          "view_statistics",
          "manage_institutions",
          "manage_roles",
        ],
      },
    ],

    isSystem: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);

export default Role;
