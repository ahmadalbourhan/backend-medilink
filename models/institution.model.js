import mongoose from 'mongoose';

const institutionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['hospital', 'clinic', 'pharmacy', 'laboratory'],
    required: true
  },
  contact: {
    address: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
  },
  services: [{ type: String }]
}, { timestamps: true });

const Institution = mongoose.model('Institution', institutionSchema);

export default Institution;