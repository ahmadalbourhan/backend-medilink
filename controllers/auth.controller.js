import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';
import Institution from '../models/institution.model.js';

import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js'

// Initialize default admin on first run
export const initializeDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin', salt);
      
      await User.create({
        name: 'System Administrator',
        email: 'admin@medicalcv.com',
        password: hashedPassword,
        role: 'admin',
        permissions: [
          'manage_patients',
          'manage_doctors', 
          'manage_medical_records',
          'manage_users',
          'view_statistics',
          'manage_institutions',
          'manage_roles'
        ],
        isActive: true
      });
      
      console.log('Default admin created: admin@medicalcv.com / admin');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password, role = 'patient', institutionId, permissions } = req.body;

    // Check if a user already exists
    const existingUser = await User.findOne({ email });

    if(existingUser) {
      const error = new Error('User already exists');
      error.statusCode = 409;
      throw error;
    }

    // Validate institution if user is not admin
    if (role !== 'admin' && institutionId) {
      const institution = await Institution.findById(institutionId);
      if (!institution) {
        const error = new Error('Institution not found');
        error.statusCode = 404;
        throw error;
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      permissions: permissions || []
    };

    // Add institutionId for non-admin users
    if (role !== 'admin' && institutionId) {
      userData.institutionId = institutionId;
    }

    const newUsers = await User.create([userData], { session });

    const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        token,
        user: {
          _id: newUsers[0]._id,
          name: newUsers[0].name,
          email: newUsers[0].email,
          role: newUsers[0].role,
          institutionId: newUsers[0].institutionId,
          permissions: newUsers[0].permissions
        },
      }
    })
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
}

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('institutionId', 'name type');

    if(!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    if (!user.isActive) {
      const error = new Error('Account is deactivated');
      error.statusCode = 403;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
      const error = new Error('Invalid password');
      error.statusCode = 401;
      throw error;
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(200).json({
      success: true,
      message: 'User signed in successfully',
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          institutionId: user.institutionId,
          permissions: user.permissions
        },
      }
    });
  } catch (error) {
    next(error);
  }
}

export const signOut = async (req, res, next) => {
  try {
    // In a stateless JWT system, the client should discard the token
    // This endpoint can be used for logging purposes
    res.status(200).json({
      success: true,
      message: 'User signed out successfully'
    });
  } catch (error) {
    next(error);
  }
}