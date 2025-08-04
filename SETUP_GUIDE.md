
# Medical CV System Setup Guide

This guide will help you set up and initialize the Medical CV System API for local development.

## Prerequisites

- **Node.js** v16 or higher ([Download Node.js](https://nodejs.org/))
- **MongoDB** running locally ([Install MongoDB](https://www.mongodb.com/try/download/community))
- **npm** (comes with Node.js)

## Step 1: Create Environment File

Create a `.env.development.local` file in the project root (or `.env` if you prefer):

```env
PORT=5500
NODE_ENV=development
DB_URI=mongodb://localhost:27017/medical_cv_system
JWT_SECRET=your_super_secret_jwt_key_here # Use a strong, unique value!
JWT_EXPIRES_IN=7d
```

> **Note:** The default MongoDB URI assumes MongoDB is running locally. Update if using a remote database.

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Start the Server

```bash
npm run dev
```

> **Tip:** `npm run dev` uses `nodemon` for hot-reloading. For production, use `npm start`.


## Step 4: Create Initial Records

### 4.1 Login as Default Admin

```bash
curl -X POST http://localhost:5500/api/v1/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@medicalcv.com",
    "password": "admin"
  }'
```

**Save the returned JWT token for admin operations.**

### 4.2 Create an Institution (Admin Only)

```bash
curl -X POST http://localhost:5500/api/v1/institutions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{
    "name": "City General Hospital",
    "type": "hospital",
    "contact": {
      "address": "123 Medical Center Dr",
      "phone": "+1-555-123-4567",
      "email": "info@cityhospital.com"
    },
    "services": ["emergency", "surgery", "cardiology"]
  }'
```

**Save the returned `_id` (institution ObjectId) for later steps.**

### 4.3 Create Institution Admin (Admin Only)

```bash
curl -X POST http://localhost:5500/api/v1/admin/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{
    "name": "Dr. Sarah Johnson",
    "email": "sarah@cityhospital.com",
    "password": "password123",
    "role": "admin_institutions",
    "institutionId": "INSTITUTION_OBJECT_ID",
    "permissions": [
      "manage_patients",
      "manage_doctors",
      "manage_medical_records",
      "manage_users"
    ]
  }'
```

**Save the returned JWT token for institution admin operations.**

### 4.4 Create Medical Staff (Institution Admin)

```bash
curl -X POST http://localhost:5500/api/v1/institutions/INSTITUTION_ID/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer INSTITUTION_ADMIN_JWT_TOKEN" \
  -d '{
    "name": "Dr. Michael Brown",
    "email": "michael@cityhospital.com",
    "password": "password123",
    "role": "doctor",
    "permissions": [
      "manage_patients",
      "manage_medical_records"
    ]
  }'
```

### 4.5 Create Patient (Medical Staff)

```bash
curl -X POST http://localhost:5500/api/v1/institutions/INSTITUTION_ID/patients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer MEDICAL_STAFF_JWT_TOKEN" \
  -d '{
    "patientId": "P001",
    "name": "John Smith",
    "dateOfBirth": "1985-03-15",
    "gender": "male",
    "bloodType": "A+",
    "contact": {
      "phone": "+1-555-111-2222",
      "email": "john@email.com",
      "address": "789 Oak Street"
    }
  }'
```

### 4.6 Create Doctor (Medical Staff)

```bash
curl -X POST http://localhost:5500/api/v1/institutions/INSTITUTION_ID/doctors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer MEDICAL_STAFF_JWT_TOKEN" \
  -d '{
    "name": "Dr. Emily Davis",
    "email": "emily@cityhospital.com",
    "specialization": "Cardiology",
    "licenseNumber": "MD123456",
    "phone": "+1-555-987-6543"
  }'
```

### 4.7 Create Medical Record (Medical Staff)

```bash
curl -X POST http://localhost:5500/api/v1/institutions/INSTITUTION_ID/medical-records \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer MEDICAL_STAFF_JWT_TOKEN" \
  -d '{
    "patientId": "P001",
    "doctorId": "DOCTOR_OBJECT_ID",
    "visitInfo": {
      "type": "consultation",
      "date": "2024-01-15",
      "isEmergency": false
    },
    "clinicalData": {
      "symptoms": "Fever and cough",
      "diagnosis": "Common cold",
      "treatment": "Rest and fluids"
    }
  }'
```

> **Replace placeholders (e.g., `INSTITUTION_ID`, `DOCTOR_OBJECT_ID`, `ADMIN_JWT_TOKEN`) with actual values from previous responses.**



## Step 5: Patient Access (React Native/Public)

Test the public patient access endpoint:

```bash
curl -X GET "http://localhost:5500/api/v1/institutions/medical-records/patient/P001"
```


## Important Notes

1. **ObjectIds**: Always use actual MongoDB ObjectIds, not string placeholders like "DOCTOR_ID".
2. **Authentication**: Most endpoints require a valid JWT token in the `Authorization` header.
3. **Patient Access**: The patient endpoint is public (no authentication needed).
4. **References**: Make sure doctorId and institutionId exist before creating medical records.
5. **Default Admin**: You can log in as the default admin with:
   - Email: `admin@medicalcv.com`
   - Password: `admin`


## Common Issues and Solutions

### Issue: "Cast to ObjectId failed"
**Solution**: Use actual ObjectIds from your database, not string placeholders.

### Issue: "Doctor not found" or "Institution not found"
**Solution**: Create the doctor and institution records first, then use their ObjectIds.

### Issue: "Unauthorized"
**Solution**: Include the JWT token in the Authorization header for protected endpoints.

### Issue: "npm run dev" or "npm start" not working
**Solution**: Ensure all dependencies are installed (`npm install`). Check your Node.js version (v16+ recommended). If you see a missing script error, check your `package.json`.



## API Endpoints Summary

### Authentication
POST   /api/v1/auth/sign-up      # Register new user
POST   /api/v1/auth/sign-in      # Login user
POST   /api/v1/auth/sign-out     # Logout user

### Admin Operations (Super Admin Only)
GET    /api/v1/admin/roles
POST   /api/v1/admin/roles
PUT    /api/v1/admin/roles/:id
DELETE /api/v1/admin/roles/:id
GET    /api/v1/admin/users
POST   /api/v1/admin/users
PUT    /api/v1/admin/users/:id
DELETE /api/v1/admin/users/:id
GET    /api/v1/admin/institutions
GET    /api/v1/admin/statistics

### Institution Management (Admin Only)
GET    /api/v1/institutions
POST   /api/v1/institutions
PUT    /api/v1/institutions/:id
DELETE /api/v1/institutions/:id

### Institution-Specific Resources
GET    /api/v1/institutions/:institutionId/users
POST   /api/v1/institutions/:institutionId/users
PUT    /api/v1/institutions/:institutionId/users/:id
DELETE /api/v1/institutions/:institutionId/users/:id
GET    /api/v1/institutions/:institutionId/patients
POST   /api/v1/institutions/:institutionId/patients
PUT    /api/v1/institutions/:institutionId/patients/:id
DELETE /api/v1/institutions/:institutionId/patients/:id
GET    /api/v1/institutions/:institutionId/doctors
POST   /api/v1/institutions/:institutionId/doctors
PUT    /api/v1/institutions/:institutionId/doctors/:id
DELETE /api/v1/institutions/:institutionId/doctors/:id
GET    /api/v1/institutions/:institutionId/medical-records
POST   /api/v1/institutions/:institutionId/medical-records
PUT    /api/v1/institutions/:institutionId/medical-records/:id
DELETE /api/v1/institutions/:institutionId/medical-records/:id

### Public Patient Access
GET    /api/v1/institutions/medical-records/patient/:patientId


## Testing with Postman

1. Import the provided Postman collection (if available) or create your own requests using the examples above.
2. Set up environment variables for ObjectIds and tokens.
3. Use the authentication endpoint to get a JWT token.
4. Use the token for subsequent requests in the `Authorization` header.

---

For more details, see the [README.md](./README.md) for API structure, endpoints, and advanced usage.