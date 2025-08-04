import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User Name is required'],
    trim: true,
    minLength: 2,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, 'User Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'User Password is required'],
    minLength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'admin_institutions', 'doctor', 'nurse', 'receptionist', 'patient'],
    default: 'patient',
  },
  institutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: function() {
      return this.role !== 'admin';
    }
  },
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
    default: true,
  },
  lastLogin: {
    type: Date,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;