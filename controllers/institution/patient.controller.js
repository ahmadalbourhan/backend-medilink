import Patient from '../../models/patient.model.js';

// Get all patients for a specific institution
export const getInstitutionPatients = async (req, res, next) => {
  try {
    const { institutionId } = req.params;
    const { page = 1, limit = 10, search } = req.query;
    
    const query = { institutionId };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { patientId: { $regex: search, $options: 'i' } }
      ];
    }

    const patients = await Patient.find(query)
      .populate('updatedBy', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Patient.countDocuments(query);

    res.status(200).json({
      success: true,
      data: patients,
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

// Get single patient for a specific institution
export const getInstitutionPatient = async (req, res, next) => {
  try {
    const { institutionId, id } = req.params;
    
    const patient = await Patient.findOne({ _id: id, institutionId })
      .populate('updatedBy', 'name email');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found in this institution'
      });
    }

    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

// Create new patient for a specific institution
export const createInstitutionPatient = async (req, res, next) => {
  try {
    const { institutionId } = req.params;
    const patientData = {
      ...req.body,
      institutionId,
      updatedBy: req.user._id
    };

    const patient = await Patient.create(patientData);

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

// Update patient for a specific institution
export const updateInstitutionPatient = async (req, res, next) => {
  try {
    const { institutionId, id } = req.params;
    const updateData = {
      ...req.body,
      updatedBy: req.user._id,
      updatedAt: new Date()
    };

    const patient = await Patient.findOneAndUpdate(
      { _id: id, institutionId },
      updateData,
      { new: true, runValidators: true }
    ).populate('updatedBy', 'name email');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found in this institution'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

// Delete patient for a specific institution
export const deleteInstitutionPatient = async (req, res, next) => {
  try {
    const { institutionId, id } = req.params;
    
    const patient = await Patient.findOneAndDelete({ _id: id, institutionId });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found in this institution'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}; 