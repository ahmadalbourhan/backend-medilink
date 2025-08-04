import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true
  },
  description: String,
  permissions: [{
    type: String,
    enum: [
      'manage_patients',
      'manage_doctors', 
      'manage_medical_records',
      'manage_users',
      'view_statistics',
      'manage_institutions',
      'manage_roles'
    ]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isSystem: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

const Role = mongoose.model('Role', roleSchema);

export default Role; 