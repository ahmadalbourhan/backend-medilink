import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User Name is required"],
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: String,
      required: [true, "User Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: [true, "User Password is required"],
      minLength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "admin_institutions"],
    },
    institutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institution",
      required: function () {
        return this.role !== "admin";
      },
    },
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
          "cross_institution_access",
          "cross_institution_modify",
          "emergency_override",
        ],
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
