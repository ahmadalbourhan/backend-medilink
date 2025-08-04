# Medical CV System API

A comprehensive medical record management system with hierarchical role-based access control and institution-specific management.

## Features

- **Default Admin System**: Pre-configured admin (admin/admin) with full system access
- **Hierarchical Role System**: Admin → Institution Admin → Medical Staff → Patients
- **Institution Isolation**: Users can only access their institution's data
- **Permission-Based Access**: Granular permissions for different operations
- **Unified Patient Records**: Single comprehensive medical record per patient
- **JWT Authentication**: Secure API access with JSON Web Tokens
- **React Native Ready**: Patient app endpoints for mobile access

## System Architecture

### Role Hierarchy
```
admin (super admin)
├── admin_institutions (institution admin)
│   ├── doctor
│   ├── nurse
│   ├── receptionist
│   └── patient (read-only)
```

### Default Admin
- **Email**: `admin@medicalcv.com`
- **Password**: `admin`
- **Permissions**: All system permissions

### API Structure
```
/api/v1/
├── auth/                    # Authentication
├── admin/                   # Super admin operations
│   ├── roles/              # Role management
│   ├── users/              # User management
│   └── institutions/       # Institution management
├── institutions/           # Institution-specific resources
│   ├── /                   # Admin: List/Create institutions
│   ├── /:id                # Admin: Get/Update/Delete institution
│   ├── /medical-records/patient/:patientId  # Public: Patient access
│   └── /:institutionId/    # Institution-specific resources
│       ├── users/          # Institution user management
│       ├── patients/       # Patient management
│       ├── doctors/        # Doctor management
│       └── medical-records/ # Medical records
```

## API Endpoints

### Authentication
```
POST /api/v1/auth/sign-up     # Register new user (with role & institution)
POST /api/v1/auth/sign-in     # Login user
POST /api/v1/auth/sign-out    # Logout user
```

### Admin Operations (Super Admin Only)
```
GET    /api/v1/admin/roles              # Get all roles
GET    /api/v1/admin/roles/:id          # Get specific role
POST   /api/v1/admin/roles              # Create role
PUT    /api/v1/admin/roles/:id          # Update role
DELETE /api/v1/admin/roles/:id          # Delete role

GET    /api/v1/admin/users              # Get all users
GET    /api/v1/admin/users/:id          # Get specific user
POST   /api/v1/admin/users              # Create user
PUT    /api/v1/admin/users/:id          # Update user
DELETE /api/v1/admin/users/:id          # Delete user

GET    /api/v1/admin/institutions       # Admin institution management
GET    /api/v1/admin/statistics         # System statistics
```

### Institution Management (Admin Only)
```
GET    /api/v1/institutions              # Get all institutions
GET    /api/v1/institutions/:id          # Get specific institution
POST   /api/v1/institutions              # Create institution
PUT    /api/v1/institutions/:id          # Update institution
DELETE /api/v1/institutions/:id          # Delete institution
```

### Institution-Specific Resources

#### Institution Users (Institution Admin)
```
GET    /api/v1/institutions/:institutionId/users              # Get institution's users
GET    /api/v1/institutions/:institutionId/users/:id          # Get specific user
POST   /api/v1/institutions/:institutionId/users              # Create user
PUT    /api/v1/institutions/:institutionId/users/:id          # Update user
DELETE /api/v1/institutions/:institutionId/users/:id          # Delete user
```

#### Patients (Medical Staff)
```
GET    /api/v1/institutions/:institutionId/patients              # Get institution's patients
GET    /api/v1/institutions/:institutionId/patients/:id          # Get specific patient
POST   /api/v1/institutions/:institutionId/patients              # Create patient
PUT    /api/v1/institutions/:institutionId/patients/:id          # Update patient
DELETE /api/v1/institutions/:institutionId/patients/:id          # Delete patient
```

#### Doctors (Medical Staff)
```
GET    /api/v1/institutions/:institutionId/doctors               # Get institution's doctors
GET    /api/v1/institutions/:institutionId/doctors/:id           # Get specific doctor
POST   /api/v1/institutions/:institutionId/doctors               # Create doctor
PUT    /api/v1/institutions/:institutionId/doctors/:id           # Update doctor
DELETE /api/v1/institutions/:institutionId/doctors/:id           # Delete doctor
```

#### Medical Records (Medical Staff)
```
GET    /api/v1/institutions/:institutionId/medical-records       # Get institution's records
GET    /api/v1/institutions/:institutionId/medical-records/:id   # Get specific record
POST   /api/v1/institutions/:institutionId/medical-records       # Create record
PUT    /api/v1/institutions/:institutionId/medical-records/:id   # Update record
DELETE /api/v1/institutions/:institutionId/medical-records/:id   # Delete record
```

### Public Patient Access (React Native)
```
GET    /api/v1/institutions/medical-records/patient/:patientId  # Get patient's own records
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Environment Variables
Create `.env.development.local` file:
```env
PORT=5500
NODE_ENV=development
DB_URI=mongodb://localhost:27017/medical_cv_system
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## API Usage Examples

### 1. Login as Default Admin
```bash
curl -X POST http://localhost:5500/api/v1/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@medicalcv.com",
    "password": "admin"
  }'
```

### 2. Create Institution (Admin Only)
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

### 3. Create Institution Admin
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

### 4. Create Medical Staff (Institution Admin)
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

### 5. Create Patient (Medical Staff)
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

### 6. Create Doctor (Medical Staff)
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

### 7. Create Medical Record (Medical Staff)
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

### 8. Patient Access (React Native App)
```bash
curl -X GET "http://localhost:5500/api/v1/institutions/medical-records/patient/P001"
```

## Role-Based Access Control

### Admin (Super Admin) Permissions
- ✅ Create, read, update, delete institutions
- ✅ Manage all users across all institutions
- ✅ Create and manage roles
- ✅ View system statistics
- ✅ Access any institution's data
- ✅ Manage permissions

### Institution Admin Permissions
- ❌ Cannot manage institutions
- ✅ Manage users within their institution
- ✅ CRUD operations on their institution's patients
- ✅ CRUD operations on their institution's doctors
- ✅ CRUD operations on their institution's medical records
- ❌ Cannot access other institutions' data

### Medical Staff Permissions (Doctor, Nurse)
- ❌ Cannot manage users
- ✅ CRUD operations on their institution's patients
- ✅ CRUD operations on their institution's doctors
- ✅ CRUD operations on their institution's medical records
- ❌ Cannot access other institutions' data

### Patient Permissions
- ❌ Cannot access institution data
- ✅ Read their own medical records via public endpoint

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Different permissions for different user types
- **Institution Isolation**: Users can only access their institution's data
- **Permission-Based Access**: Granular permissions for specific operations
- **Input Validation**: Comprehensive data validation
- **Error Handling**: Proper error responses
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers

## Database Schema

### User Schema
```javascript
{
  name: String,
  email: String,
  password: String,
  role: String,              // 'admin', 'admin_institutions', 'doctor', 'nurse', 'receptionist', 'patient'
  institutionId: ObjectId,   // Required for non-admin users
  permissions: Array,        // Array of permission strings
  isActive: Boolean,
  lastLogin: Date,
  createdBy: ObjectId        // Links to user who created this user
}
```

### Role Schema
```javascript
{
  name: String,              // Unique role name
  displayName: String,       // Human-readable name
  description: String,
  permissions: Array,        // Array of permission strings
  isActive: Boolean,
  isSystem: Boolean,         // System roles cannot be deleted
  createdBy: ObjectId        // Links to user who created this role
}
```

### Patient Schema
```javascript
{
  patientId: String,
  name: String,
  dateOfBirth: Date,
  gender: String,
  bloodType: String,
  contact: Object,
  emergencyContact: Object,
  allergies: String,
  insuranceInfo: Object,
  institutionId: ObjectId,   // Links to institution
  updatedBy: ObjectId        // Links to user
}
```

### Doctor Schema
```javascript
{
  name: String,
  email: String,
  specialization: String,
  licenseNumber: String,
  phone: String,
  address: String,
  institutionId: ObjectId,   // Links to institution
  isActive: Boolean
}
```

### Medical Record Schema
```javascript
{
  patientId: String,
  doctorId: ObjectId,        // Links to doctor
  institutionId: ObjectId,   // Links to institution
  visitInfo: Object,
  clinicalData: Object,
  prescriptions: Array,
  labResults: Array,
  attachments: Array,
  createdBy: ObjectId,       // Links to user
  updatedBy: ObjectId        // Links to user
}
```

## Error Handling

The API returns consistent error responses:

```javascript
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden (Insufficient permissions)
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

## Development

### Project Structure
```
backend/
├── app.js                    # Main application file
├── config/
│   └── env.js              # Environment configuration
├── controllers/             # Route controllers
│   ├── admin/              # Admin controllers
│   └── institution/        # Institution controllers
├── database/
│   └── mongodb.js          # Database connection
├── middlewares/            # Custom middlewares
├── models/                 # Mongoose models
├── routes/                 # API routes
└── utils/                  # Utility functions
```

### Adding New Features

1. **Create Model**: Define schema in `models/`
2. **Create Controller**: Implement business logic in `controllers/`
3. **Create Routes**: Define endpoints in `routes/`
4. **Add Authorization**: Use appropriate middleware
5. **Test**: Use Postman or curl to test endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
