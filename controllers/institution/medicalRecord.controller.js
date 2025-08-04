import MedicalRecord from '../../models/medicalRecord.model.js';
import Patient from '../../models/patient.model.js';

// Get all medical records for a specific institution
export const getInstitutionMedicalRecords = async (req, res, next) => {
  try {
    const { institutionId } = req.params;
    const { 
      page = 1, 
      limit = 10, 
      patientId, 
      doctorId,
      visitType,
      dateFrom,
      dateTo 
    } = req.query;
    
    const query = { institutionId };
    
    if (patientId) query.patientId = patientId;
    if (doctorId) query.doctorId = doctorId;
    if (visitType) query['visitInfo.type'] = visitType;
    
    if (dateFrom || dateTo) {
      query['visitInfo.date'] = {};
      if (dateFrom) query['visitInfo.date'].$gte = new Date(dateFrom);
      if (dateTo) query['visitInfo.date'].$lte = new Date(dateTo);
    }

    const medicalRecords = await MedicalRecord.find(query)
      .populate('doctorId', 'name specialization')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ 'visitInfo.date': -1 });

    const total = await MedicalRecord.countDocuments(query);

    res.status(200).json({
      success: true,
      data: medicalRecords,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get medical records by patient ID (for patient app - PUBLIC ACCESS)
export const getPatientMedicalRecords = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Verify patient exists
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    const medicalRecords = await MedicalRecord.find({ patientId })
      .populate('doctorId', 'name specialization')
      .populate('institutionId', 'name type')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ 'visitInfo.date': -1 });

    const total = await MedicalRecord.countDocuments({ patientId });

    res.status(200).json({
      success: true,
      data: medicalRecords,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single medical record for a specific institution
export const getInstitutionMedicalRecord = async (req, res, next) => {
  try {
    const { institutionId, id } = req.params;
    
    const medicalRecord = await MedicalRecord.findOne({ _id: id, institutionId })
      .populate('doctorId', 'name specialization')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found in this institution'
      });
    }

    res.status(200).json({
      success: true,
      data: medicalRecord
    });
  } catch (error) {
    next(error);
  }
};

// Create new medical record for a specific institution
export const createInstitutionMedicalRecord = async (req, res, next) => {
  try {
    const { institutionId } = req.params;
    const recordData = {
      ...req.body,
      institutionId,
      createdBy: req.user._id,
      updatedBy: req.user._id
    };

    const medicalRecord = await MedicalRecord.create(recordData);

    const populatedRecord = await MedicalRecord.findById(medicalRecord._id)
      .populate('doctorId', 'name specialization')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Medical record created successfully',
      data: populatedRecord
    });
  } catch (error) {
    next(error);
  }
};

// Update medical record for a specific institution
export const updateInstitutionMedicalRecord = async (req, res, next) => {
  try {
    const { institutionId, id } = req.params;
    const updateData = {
      ...req.body,
      updatedBy: req.user._id,
      updatedAt: new Date()
    };

    const medicalRecord = await MedicalRecord.findOneAndUpdate(
      { _id: id, institutionId },
      updateData,
      { new: true, runValidators: true }
    )
    .populate('doctorId', 'name specialization')
    .populate('updatedBy', 'name email');

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found in this institution'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Medical record updated successfully',
      data: medicalRecord
    });
  } catch (error) {
    next(error);
  }
};

// Delete medical record for a specific institution
export const deleteInstitutionMedicalRecord = async (req, res, next) => {
  try {
    const { institutionId, id } = req.params;
    
    const medicalRecord = await MedicalRecord.findOneAndDelete({ _id: id, institutionId });

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found in this institution'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Medical record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}; 