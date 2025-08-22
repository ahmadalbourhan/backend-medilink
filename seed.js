import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectToDatabase from "./database/mongodb.js";

// Import models
import Institution from "./models/institution.model.js";
import User from "./models/user.model.js";
import Doctor from "./models/doctor.model.js";
import Patient from "./models/patient.model.js";
import MedicalRecord from "./models/medicalRecord.model.js";

// Sample data
const institutions = [
  {
    name: "City General Hospital",
    type: "hospital",
    contact: {
      address: "123 Main Street, Downtown, City",
      phone: "+1-555-0101",
      email: "info@citygeneral.com",
    },
    services: [
      "Emergency Care",
      "Surgery",
      "Cardiology",
      "Pediatrics",
      "Oncology",
    ],
  },
  {
    name: "Community Medical Center",
    type: "clinic",
    contact: {
      address: "456 Oak Avenue, Suburbia, City",
      phone: "+1-555-0102",
      email: "contact@communitymed.com",
    },
    services: ["Primary Care", "Dental", "Mental Health", "Physical Therapy"],
  },
  {
    name: "Specialty Surgical Institute",
    type: "hospital",
    contact: {
      address: "789 Pine Road, Medical District, City",
      phone: "+1-555-0103",
      email: "admin@specialty.com",
    },
    services: [
      "Orthopedic Surgery",
      "Neurosurgery",
      "Cardiac Surgery",
      "Plastic Surgery",
    ],
  },
  {
    name: "Riverside Family Clinic",
    type: "clinic",
    contact: {
      address: "321 River Drive, Riverside, City",
      phone: "+1-555-0104",
      email: "hello@riverside.com",
    },
    services: ["Family Medicine", "Women's Health", "Pediatrics", "Geriatrics"],
  },
];

const users = [
  {
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@citygeneral.com",
    password: "password123",
    role: "admin_institutions",
    institutionId: null, // Will be set after institution creation
  },
  {
    name: "Dr. Michael Chen",
    email: "michael.chen@communitymed.com",
    password: "password123",
    role: "admin_institutions",
    institutionId: null,
  },
  {
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@specialty.com",
    password: "password123",
    role: "admin_institutions",
    institutionId: null,
  },
  {
    name: "Dr. James Wilson",
    email: "james.wilson@riverside.com",
    password: "password123",
    role: "admin_institutions",
    institutionId: null,
  },
];

const doctors = [
  {
    name: "Dr. Robert Smith",
    email: "robert.smith@citygeneral.com",
    password: "password123",
    phone: "+1-555-0201",
    specialization: "Cardiology",
    licenseNumber: "MD12345",
    address: "123 Main Street, Downtown, City",
    institutionIds: [], // Will be set after institution creation
  },
  {
    name: "Dr. Lisa Wang",
    email: "lisa.wang@citygeneral.com",
    password: "password123",
    phone: "+1-555-0202",
    specialization: "Pediatrics",
    licenseNumber: "MD12346",
    address: "123 Main Street, Downtown, City",
    institutionIds: [],
  },
  {
    name: "Dr. David Brown",
    email: "david.brown@communitymed.com",
    password: "password123",
    phone: "+1-555-0203",
    specialization: "Family Medicine",
    licenseNumber: "MD12347",
    address: "456 Oak Avenue, Suburbia, City",
    institutionIds: [],
  },
  {
    name: "Dr. Maria Garcia",
    email: "maria.garcia@specialty.com",
    password: "password123",
    phone: "+1-555-0204",
    specialization: "Orthopedic Surgery",
    licenseNumber: "MD12348",
    address: "789 Pine Road, Medical District, City",
    institutionIds: [],
  },
  {
    name: "Dr. Thomas Lee",
    email: "thomas.lee@riverside.com",
    password: "password123",
    phone: "+1-555-0205",
    specialization: "Geriatrics",
    licenseNumber: "MD12349",
    address: "321 River Drive, Riverside, City",
    institutionIds: [],
  },
  {
    name: "Dr. Demo Doctor",
    email: "doctor@hospital.com",
    password: "password123",
    phone: "+1-555-0999",
    specialization: "General Medicine",
    licenseNumber: "MD99999",
    address: "Demo Address, Demo City",
    institutionIds: [],
  },
];

const patients = [
  {
    password: "password123",
    name: "John Anderson",
    dateOfBirth: "1985-03-15",
    gender: "male",
    isPregnant: false,
    bloodType: "O+",
    contact: {
      phone: "+1-555-0301",
      email: "john.anderson@email.com",
      address: "100 Elm Street, Downtown, City",
    },
    emergencyContact: {
      name: "Mary Anderson",
      phone: "+1-555-0302",
      relationship: "Spouse",
    },
    allergies: ["Penicillin"],
    insuranceInfo: {
      insuranceType: "private",
      provider: "Blue Cross Blue Shield",
      policyNumber: "BCBS123456",
    },
    institutionId: null, // Will be set after institution creation
  },
  {
    password: "password123",
    name: "Sarah Martinez",
    dateOfBirth: "1992-07-22",
    gender: "female",
    isPregnant: false,
    bloodType: "A-",
    contact: {
      phone: "+1-555-0303",
      email: "sarah.martinez@email.com",
      address: "200 Maple Avenue, Suburbia, City",
    },
    emergencyContact: {
      name: "Carlos Martinez",
      phone: "+1-555-0304",
      relationship: "Father",
    },
    allergies: [],
    insuranceInfo: {
      insuranceType: "government",
      provider: "Medicare",
      policyNumber: "MC789012",
    },
    institutionId: null,
  },
  {
    password: "password123",
    name: "Michael Thompson",
    dateOfBirth: "1978-11-08",
    gender: "male",
    isPregnant: false,
    bloodType: "B+",
    contact: {
      phone: "+1-555-0305",
      email: "michael.thompson@email.com",
      address: "300 Cedar Lane, Riverside, City",
    },
    emergencyContact: {
      name: "Jennifer Thompson",
      phone: "+1-555-0306",
      relationship: "Sister",
    },
    allergies: ["Shellfish", "Peanuts"],
    insuranceInfo: {
      insuranceType: "employer",
      provider: "Aetna",
      policyNumber: "AE345678",
    },
    institutionId: null,
  },
  {
    password: "password123",
    name: "Emily Davis",
    dateOfBirth: "1995-04-12",
    gender: "female",
    isPregnant: false,
    bloodType: "AB+",
    contact: {
      phone: "+1-555-0307",
      email: "emily.davis@email.com",
      address: "400 Birch Road, Medical District, City",
    },
    emergencyContact: {
      name: "Robert Davis",
      phone: "+1-555-0308",
      relationship: "Brother",
    },
    allergies: ["Latex"],
    insuranceInfo: {
      insuranceType: "private",
      provider: "UnitedHealth",
      policyNumber: "UH901234",
    },
    institutionId: null,
  },
  {
    password: "password123",
    name: "Christopher Wilson",
    dateOfBirth: "1988-09-25",
    gender: "male",
    isPregnant: false,
    bloodType: "O-",
    contact: {
      phone: "+1-555-0309",
      email: "chris.wilson@email.com",
      address: "500 Spruce Street, Downtown, City",
    },
    emergencyContact: {
      name: "Patricia Wilson",
      phone: "+1-555-0310",
      relationship: "Mother",
    },
    allergies: ["Aspirin"],
    insuranceInfo: {
      insuranceType: "military",
      provider: "Tricare",
      policyNumber: "TR567890",
    },
    institutionId: null,
  },
];

const medicalRecords = [
  {
    patientId: null, // Will be set after patient creation
    institutionId: null, // Will be set after institution creation
    doctorId: null, // Will be set after doctor creation
    visitInfo: {
      type: "consultation",
      date: "2024-01-15",
      isEmergency: false,
    },
    clinicalData: {
      symptoms: "Annual physical examination",
      diagnosis: "Healthy",
      treatment: "No treatment needed",
      notes: "Patient is in good health, recommend annual follow-up",
    },
    prescriptions: [],
    labResults: [],
    attachments: [],
    createdBy: null, // Will be set after institution creation
    updatedBy: null, // Will be set after institution creation
  },
  {
    patientId: null,
    institutionId: null,
    doctorId: null,
    visitInfo: {
      type: "consultation",
      date: "2024-01-20",
      isEmergency: false,
    },
    clinicalData: {
      symptoms: "Chest pain, shortness of breath",
      diagnosis: "Angina",
      treatment: "Nitroglycerin, lifestyle modifications",
      notes: "Patient reports chest pain during physical activity",
    },
    prescriptions: [
      {
        medicationName: "Nitroglycerin",
        dosage: "0.4mg",
        frequency: "As needed",
        duration: "30 days",
        instructions: "Place under tongue when chest pain occurs",
      },
      {
        medicationName: "Aspirin",
        dosage: "81mg",
        frequency: "Daily",
        duration: "Lifetime",
        instructions: "Take with food",
      },
    ],
    labResults: [],
    attachments: [],
    createdBy: null,
    updatedBy: null,
  },
  {
    patientId: null,
    institutionId: null,
    doctorId: null,
    visitInfo: {
      type: "emergency",
      date: "2024-01-25",
      isEmergency: true,
    },
    clinicalData: {
      symptoms: "Severe abdominal pain, nausea",
      diagnosis: "Appendicitis",
      treatment: "Emergency appendectomy",
      notes: "Patient underwent successful laparoscopic appendectomy",
    },
    prescriptions: [
      {
        medicationName: "Pain medication",
        dosage: "5mg",
        frequency: "Every 6 hours",
        duration: "7 days",
        instructions: "Take as needed for pain",
      },
      {
        medicationName: "Antibiotics",
        dosage: "500mg",
        frequency: "Twice daily",
        duration: "10 days",
        instructions: "Take with food",
      },
    ],
    labResults: [],
    attachments: [],
    createdBy: null,
    updatedBy: null,
  },
  {
    patientId: null,
    institutionId: null,
    doctorId: null,
    visitInfo: {
      type: "follow-up",
      date: "2024-02-01",
      isEmergency: false,
    },
    clinicalData: {
      symptoms: "Post-surgery recovery",
      diagnosis: "Recovering well",
      treatment: "Wound care, physical therapy",
      notes:
        "Surgical site healing well, patient progressing with physical therapy",
    },
    prescriptions: [
      {
        medicationName: "Pain medication",
        dosage: "5mg",
        frequency: "As needed",
        duration: "7 days",
        instructions: "Take only if pain is severe",
      },
    ],
    labResults: [],
    attachments: [],
    createdBy: null,
    updatedBy: null,
  },
  {
    patientId: null,
    institutionId: null,
    doctorId: null,
    visitInfo: {
      type: "immunization",
      date: "2024-02-05",
      isEmergency: false,
    },
    clinicalData: {
      symptoms: "Annual pediatric checkup",
      diagnosis: "Normal development",
      treatment: "Vaccinations updated",
      notes:
        "Child meeting all developmental milestones, vaccinations administered",
    },
    prescriptions: [],
    labResults: [],
    attachments: [],
    createdBy: null,
    updatedBy: null,
  },
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log("Starting database seeding...");

    // Clear existing data
    await Institution.deleteMany({});
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await MedicalRecord.deleteMany({});

    console.log("Cleared existing data");

    // Create institutions
    const createdInstitutions = [];
    for (const institution of institutions) {
      const newInstitution = new Institution(institution);
      const savedInstitution = await newInstitution.save();
      createdInstitutions.push(savedInstitution);
      console.log(`Created institution: ${savedInstitution.name}`);
    }

    // Create users (institution admins)
    const createdUsers = [];
    for (let i = 0; i < users.length; i++) {
      const userData = { ...users[i] };
      userData.institutionId = createdInstitutions[i]._id;

      // Hash password
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);

      const newUser = new User(userData);
      const savedUser = await newUser.save();
      createdUsers.push(savedUser);
      console.log(`Created user: ${savedUser.name}`);
    }

    // Create doctors
    const createdDoctors = [];
    for (let i = 0; i < doctors.length; i++) {
      const doctorData = { ...doctors[i] };
      doctorData.institutionIds = [
        createdInstitutions[i % createdInstitutions.length]._id,
      ];

      // Hash password
      const salt = await bcrypt.genSalt(10);
      doctorData.password = await bcrypt.hash(doctorData.password, salt);

      const newDoctor = new Doctor(doctorData);
      const savedDoctor = await newDoctor.save();
      createdDoctors.push(savedDoctor);
      console.log(`Created doctor: ${savedDoctor.name}`);
    }

    // Create patients
    const createdPatients = [];
    for (let i = 0; i < patients.length; i++) {
      const patientData = { ...patients[i] };
      patientData.institutionId =
        createdInstitutions[i % createdInstitutions.length]._id;

      // Hash password
      const salt = await bcrypt.genSalt(10);
      patientData.password = await bcrypt.hash(patientData.password, salt);

      const newPatient = new Patient(patientData);
      const savedPatient = await newPatient.save();
      createdPatients.push(savedPatient);
      console.log(
        `Created patient: ${savedPatient.name} with ID: ${savedPatient.patientId}`
      );
    }

    // Create medical records
    for (let i = 0; i < medicalRecords.length; i++) {
      const recordData = { ...medicalRecords[i] };
      recordData.patientId =
        createdPatients[i % createdPatients.length].patientId; // Use patientId, not _id
      recordData.doctorId = createdDoctors[i % createdDoctors.length]._id;
      recordData.institutionId =
        createdInstitutions[i % createdInstitutions.length]._id;
      recordData.createdBy =
        createdInstitutions[i % createdInstitutions.length]._id;
      recordData.updatedBy =
        createdInstitutions[i % createdInstitutions.length]._id;

      const newRecord = new MedicalRecord(recordData);
      const savedRecord = await newRecord.save();
      console.log(
        `Created medical record for patient: ${recordData.patientId}`
      );
    }

    console.log("Database seeding completed successfully!");
    console.log(`Created ${createdInstitutions.length} institutions`);
    console.log(`Created ${createdUsers.length} users`);
    console.log(`Created ${createdDoctors.length} doctors`);
    console.log(`Created ${createdPatients.length} patients`);
    console.log(`Created ${medicalRecords.length} medical records`);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  }
};

// Run the seed function
connectToDatabase().then(() => {
  seedDatabase();
});
