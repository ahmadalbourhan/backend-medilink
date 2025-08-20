# Database Seeding Guide

This guide explains how to use the seed script to populate your database with mock data for testing and development.

## What the Seed Script Creates

The seed script will create the following mock data:

### 1. Institutions (4)

- **City General Hospital** - Hospital with emergency care, surgery, cardiology, pediatrics, oncology
- **Community Medical Center** - Clinic with primary care, dental, mental health, physical therapy
- **Specialty Surgical Institute** - Hospital with orthopedic surgery, neurosurgery, cardiac surgery, plastic surgery
- **Riverside Family Clinic** - Clinic with family medicine, women's health, pediatrics, geriatrics

### 2. Users (4)

- **Dr. Sarah Johnson** - Institution admin for City General Hospital
- **Dr. Michael Chen** - Institution admin for Community Medical Center
- **Dr. Emily Rodriguez** - Institution admin for Specialty Surgical Institute
- **Dr. James Wilson** - Institution admin for Riverside Family Clinic

**Default Password**: `password123` for all users

### 3. Doctors (5)

- **Dr. Robert Smith** - Cardiologist (City General Hospital)
- **Dr. Lisa Wang** - Pediatrician (City General Hospital)
- **Dr. David Brown** - Family Medicine (Community Medical Center)
- **Dr. Maria Garcia** - Orthopedic Surgeon (Specialty Surgical Institute)
- **Dr. Thomas Lee** - Geriatrician (Riverside Family Clinic)

**Default Password**: `password123` for all doctors

### 4. Patients (5)

- **John Anderson** - Male, O+ blood type, 1985 birth, Private insurance
- **Sarah Martinez** - Female, A- blood type, 1992 birth, Government insurance
- **Michael Thompson** - Male, B+ blood type, 1978 birth, Employer insurance
- **Emily Davis** - Female, AB+ blood type, 1995 birth, Private insurance
- **Christopher Wilson** - Male, O- blood type, 1988 birth, Military insurance

**Default Password**: `password123` for all patients

**Note**: Each patient gets a unique `patientId` automatically generated (e.g., P123456789)

### 5. Medical Records (5)

- **Regular Checkup** - Healthy patient, no treatment needed
- **Consultation** - Angina diagnosis with prescriptions (Nitroglycerin, Aspirin)
- **Emergency** - Appendicitis surgery with pain medication and antibiotics
- **Follow-up** - Post-surgery recovery with wound care instructions
- **Immunization** - Pediatric checkup with vaccinations

## Data Structure & Relationships

### Patient Model Features

- **Auto-generated patientId**: Each patient gets a unique "P" + 9-digit ID
- **Contact Information**: Structured as `contact.phone`, `contact.email`, `contact.address`
- **Emergency Contact**: Name, phone, and relationship
- **Allergies**: Array of allergy strings
- **Insurance Info**: Type, provider, and policy number
- **Pregnancy Status**: Boolean field for female patients

### Doctor Model Features

- **Institution Assignment**: Doctors are assigned to institutions via `institutionIds` array
- **Specialization**: Medical specialty field
- **License Numbers**: Unique medical license identifiers
- **Address**: Physical address information

### Medical Record Model Features

- **Visit Types**: consultation, emergency, follow-up, surgery, lab-test, immunization
- **Clinical Data**: Structured symptoms, diagnosis, treatment, and notes
- **Prescriptions**: Detailed medication information with dosage and instructions
- **Lab Results**: Test results with reference ranges and status
- **Attachments**: File upload support for medical documents

### Institution Model Features

- **Contact Structure**: Address, phone, and email in nested contact object
- **Service Arrays**: List of medical services offered
- **Type Classification**: Hospital or clinic designation

## How to Run the Seed Script

### Prerequisites

1. Make sure MongoDB is running
2. Ensure your `.env` file has the correct `MONGODB_URI`
3. Install dependencies: `npm install`

### Running the Seed Script

```bash
# Option 1: Using npm script
npm run seed

# Option 2: Direct node command
node seed.js
```

### What Happens

1. **Connects** to MongoDB using your environment variables
2. **Clears** all existing data from the collections
3. **Creates** institutions first
4. **Creates** users (institution admins) with hashed passwords
5. **Creates** doctors and assigns them to institutions
6. **Creates** patients and assigns them to institutions (auto-generates patientId)
7. **Creates** medical records linking patients, doctors, and institutions
8. **Closes** the database connection and exits

## Sample Login Credentials

After running the seed script, you can log in with:

### Institution Admins

- **City General Hospital**: `sarah.johnson@citygeneral.com` / `password123`
- **Community Medical Center**: `michael.chen@communitymed.com` / `password123`
- **Specialty Surgical Institute**: `emily.rodriguez@specialty.com` / `password123`
- **Riverside Family Clinic**: `james.wilson@riverside.com` / `password123`

### Doctors

- **Dr. Robert Smith**: `robert.smith@citygeneral.com` / `password123`
- **Dr. Lisa Wang**: `lisa.wang@citygeneral.com` / `password123`
- **Dr. David Brown**: `david.brown@communitymed.com` / `password123`
- **Dr. Maria Garcia**: `maria.garcia@specialty.com` / `password123`
- **Dr. Thomas Lee**: `thomas.lee@riverside.com` / `password123`

### Patients

- **John Anderson**: `john.anderson@email.com` / `password123`
- **Sarah Martinez**: `sarah.martinez@email.com` / `password123`
- **Michael Thompson**: `michael.thompson@email.com` / `password123`
- **Emily Davis**: `emily.davis@email.com` / `password123`
- **Christopher Wilson**: `chris.wilson@email.com` / `password123`

## Data Relationships

- Each institution has 1 institution admin user
- Doctors are assigned to specific institutions
- Patients are assigned to specific institutions
- Medical records link patients (via patientId), doctors, and institutions
- All passwords are automatically hashed using bcrypt
- Patient IDs are auto-generated and unique

## Customizing the Seed Data

To modify the mock data:

1. **Edit the arrays** in `seed.js` (institutions, users, doctors, patients, medicalRecords)
2. **Add more entries** or modify existing ones
3. **Run the seed script again** to refresh the database

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Check if MongoDB is running
   - Verify your `MONGODB_URI` in `.env`

2. **Model Import Errors**

   - Ensure all model files exist and are properly exported
   - Check file paths in the import statements

3. **Validation Errors**

   - Verify that the mock data matches your model schemas
   - Check required fields and data types

4. **Patient ID Generation Issues**
   - The patientId is auto-generated by the Patient model
   - Ensure the Patient model is properly imported

### Reset Database

If you need to completely reset your database:

```bash
# Run the seed script again
npm run seed

# Or manually clear collections in MongoDB
```

## Notes

- The seed script will **overwrite** all existing data
- Passwords are automatically hashed using bcrypt
- All dates are set to 2024 for consistency
- The script distributes data evenly across institutions
- Medical records include realistic medical scenarios and prescriptions
- Patient IDs are automatically generated (e.g., P123456789)
- All data follows the exact schema structure of your models
