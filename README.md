# **Medical CV System – API & Architecture Specification**

A **comprehensive, secure, and scalable medical record management system** designed with **hierarchical role-based access control (RBAC)**, **institution-specific operations**, and **cross-institution patient data sharing**. The system supports **Next.js/React frontend** and **React Native mobile applications**, and complies with **privacy regulations (GDPR)**.

---

## **1. Key Features**

- **Preconfigured Super Admin**: Default credentials with full system access for initial setup.
- **Hierarchical Role System**:

  - **Super Admin (System Administrator)** – Full control across all institutions.
  - **Institution Admin** – Manages data within their institution and has cross-institution read access and manages patient records assigned to them.
  - **Patient** – Can view their own medical history via secure endpoints.

- **Permission-Based Access**: Granular permission control for all operations.
- **Unified Patient Records**: One patient profile across institutions, ensuring seamless history tracking.
- **JWT Authentication**: Token-based authentication for web and mobile clients.
- **React Native & Next.js Ready**: Mobile endpoints, responsive design, and TypeScript-ready API contracts.
- **Cross-Institution Access**: Authorized institution admins and doctors can view patients’ data across institutions.
- **Consent Management**: GDPR-compliant consent system with emergency override logging.

---

## **2. System Architecture**

### **Role Hierarchy**

```
admin (super admin)
├── admin_institutions (institution admin)
│
```

### **Default Admin Account**

- **Email**: `admin@medicalcv.com`
- **Password**: `admin`
- **Permissions**: All available system permissions.

---

## **3. Final API Structure**

````
/api/v1/
├── auth/                     # Authentication
│   ├── POST /sign-in         # The admin give a credentials for each Institution created and patient
│   └── POST /sign-out

├── admin/                    # Super Admin Only
│   ├── roles/                # Role management (CRUD for institution_admin only)
│   ├── users/                # Global user management (CRUD for institution_admin only)
│   └── institutions/         # Global institution management

├── institutions/             # Institution CRUD (Admin only)
│   ├── GET|POST|PUT|DELETE

├── patients/                 # Shared patient profiles via institutions but secured if the user not an institution_admin
│   ├── GET /                 # List all (privacy-filtered)
│   ├── GET /:id               # View details
│   ├── POST /                 # Create patient
│   ├── PUT /:id               # Update
│   ├── DELETE /:id            # Delete
│   └── GET /:patientId/export # GDPR export

├── doctors/                  # Shared doctor profiles and edited with CRUD by institution_admin
│   ├── CRUD operations

├── medical-records/          # Shared medical records and edited with CRUD by institution_admin
│   ├── GET /                 # All records (privacy-filtered)
│   ├── GET /:id               # Record details
│   ├── POST /                 # Create record
│   ├── PUT /:id               # Update record
│   ├── DELETE /:id            # Delete record
│   └── GET /patient/:id       # Public patient history

├── patients/:patientId/medical-records/ # Patient-specific record creation

---

## **4. Role-Based Permissions**

### **Permission Matrix**

| Permission               | Description                           |
| ------------------------ | ------------------------------------- |
| `manage_patients`        | Create, read, update, delete patients |
| `manage_doctors`         | CRUD operations on doctors            |
| `manage_medical_records` | CRUD medical records                  |
| `manage_users`           | CRUD users                            |
| `view_statistics`        | System statistics and reports         |
| `manage_institutions`    | Institution CRUD                      |
| `manage_roles`           | Role CRUD                             |
| `data_export`            | GDPR patient data export              |

---

## **5. Security & Compliance**

- **JWT Authentication** with short-lived access tokens & refresh tokens.
- **Role & Permission Enforcement** at middleware level.
- **Granular Consent** for data sharing.
- **Emergency Override** with mandatory audit logging.
- **Audit Trails** for all data access/modification.
- **Rate Limiting** & IP whitelisting for sensitive endpoints.
- **Data Encryption** at rest and in transit (TLS/SSL).
- **GDPR Compliance** with export & deletion features.
- **Security Headers** via Helmet (HSTS, CSP, etc.).

---

## **6. Database Schema**

### **User Schema**

```javascript
{
  name: String,
  email: String,
  password: String,
  role: ['admin', 'admin_institutions'],              //Only 'admin', 'admin_institutions'
  permissions: [String]
}
````

### **Role Schema**

```javascript
{
  name: String,
  displayName: String,
  description: String,
  permissions: [String],
  isSystem: Boolean
}
```

### **Patient Schema**

```javascript
{
  patientId: String,
  name: String,
  dateOfBirth: Date,
  gender: String,            // 'male' or 'female'
  isPregnant: Boolean,       // Required if gender is female
  bloodType: String,
  contact: Object,
  emergencyContact: Object,
  allergies: String,
  insuranceInfo: Object,
  updatedBy: ObjectId
}
```

### **Doctor Schema**

```javascript
{
  name: String,
  email: String,
  specialization: String,
  licenseNumber: String,
  phone: String,
  address: String,
  institutionId: ObjectId
}
```

### **Medical Record Schema**

```javascript
{
  patientId: String,
  doctorId: ObjectId,
  institutionId: ObjectId,
  visitInfo: Object,
  clinicalData: Object,
  prescriptions: Array,
  labResults: Array,
  attachments: Array,
  createdBy: ObjectId,
  updatedBy: ObjectId
}
```

---

## **7. MongoDB Indexes** (Performance Optimization)

- **Patients**: `patientId`, `institutionId+updatedAt`, `name text`, `contact.phone`.
- **Medical Records**: `patientId+visitInfo.date`, `doctorId+visitInfo.date`, `institutionId+visitInfo.date`.
- **Doctors**: `institutionId`, `specialization`, `licenseNumber`.
- **Users**: `email`, `role`.

---
