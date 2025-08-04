import Doctor from '../../models/doctor.model.js';

// Get all doctors for a specific institution
export const getInstitutionDoctors = async (req, res, next) => {
  try {
    const { institutionId } = req.params;
    const { page = 1, limit = 10, specialization, search } = req.query;
    
    const query = { institutionId };
    if (specialization) query.specialization = specialization;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { licenseNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const doctors = await Doctor.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Doctor.countDocuments(query);

    res.status(200).json({
      success: true,
      data: doctors,
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

// Get single doctor for a specific institution
export const getInstitutionDoctor = async (req, res, next) => {
  try {
    const { institutionId, id } = req.params;
    
    const doctor = await Doctor.findOne({ _id: id, institutionId });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found in this institution'
      });
    }

    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

// Create new doctor for a specific institution
export const createInstitutionDoctor = async (req, res, next) => {
  try {
    const { institutionId } = req.params;
    const doctorData = {
      ...req.body,
      institutionId
    };

    const doctor = await Doctor.create(doctorData);

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

// Update doctor for a specific institution
export const updateInstitutionDoctor = async (req, res, next) => {
  try {
    const { institutionId, id } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    const doctor = await Doctor.findOneAndUpdate(
      { _id: id, institutionId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found in this institution'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Doctor updated successfully',
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

// Delete doctor for a specific institution
export const deleteInstitutionDoctor = async (req, res, next) => {
  try {
    const { institutionId, id } = req.params;
    
    const doctor = await Doctor.findOneAndDelete({ _id: id, institutionId });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found in this institution'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}; 