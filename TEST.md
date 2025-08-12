# admin

## admin login

post: http://localhost:5500/api/v1/auth/admin/sign-in
json: {
"email": "admin@medicalcv.com",
"password": "admin"
}
token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

## create institutions

post: http://localhost:5500/api/v1/admin/institutions
json: {
"name": "City Hospital",
"type": "hospital",
"contact": {
"address": "123 Main St, Downtown",
"phone": "+1234567890",
"email": "info@cityhospital.com"
},
"services": ["emergency", "cardiology", "surgery"]
}
use admin token

## get institutions

get: http://localhost:5500/api/v1/admin/institutions
response:
{
"success": true,
"data": [
{
"contact": {
"address": "123 Tripolie St, Downtown",
"phone": "+1234567891",
"email": "info@tripoliehospital.com"
},
"\_id": "689b28c59439cb29a8b43ca6",
"name": "Tripolie Hospital",
"type": "hospital",
"services": [
"emergency",
"cardiology",
"surgery"
],
"createdAt": "2025-08-12T11:43:01.053Z",
"updatedAt": "2025-08-12T11:43:01.053Z",
"**v": 0
},
{
"contact": {
"address": "123 Main St, Downtown",
"phone": "+1234567890",
"email": "info@cityhospital.com"
},
"\_id": "689b0ffcbaad48dedc2e581f",
"name": "City Hospital",
"type": "hospital",
"services": [
"emergency",
"cardiology",
"surgery"
],
"createdAt": "2025-08-12T09:57:16.254Z",
"updatedAt": "2025-08-12T09:57:16.254Z",
"**v": 0
}
],
"pagination": {
"currentPage": 1,
"totalPages": 1,
"totalItems": 2,
"itemsPerPage": 10
}
}

use admin token

### get specific institutions id

get: http://localhost:5500/api/v1/admin/institutions/:id
response:
{
"success": true,
"data": {
"contact": {
"address": "123 Tripolie St, Downtown",
"phone": "+1234567891",
"email": "info@tripoliehospital.com"
},
"\_id": "689b28c59439cb29a8b43ca6",
"name": "Tripolie Hospital",
"type": "hospital",
"services": [
"emergency",
"cardiology",
"surgery"
],
"createdAt": "2025-08-12T11:43:01.053Z",
"updatedAt": "2025-08-12T11:43:01.053Z",
"\_\_v": 0
}
}
use admin token

### delete, update

put: http://localhost:5500/api/v1/admin/institutions/:id
delete: http://localhost:5500/api/v1/admin/institutions/:id
use admin token

## Create User:

post: http://localhost:5500/api/v1/admin/users
json: {
"name": "Hospital Administrator",
"email": "admin@cityhospital.com",
"password": "SecurePass123",
"role": "admin_institutions",
"institutionId": "689b0ffcbaad48dedc2e581f",
"permissions": [
"manage_patients",
"manage_doctors",
"manage_medical_records",
"manage_users",
"view_statistics",
"manage_roles"
]
}
use admin token

## GET User:

get: http://localhost:5500/api/v1/admin/users
use admin token
response:{
"success": true,
"data": [
{
"\_id": "689b28f19439cb29a8b43cae",
"name": "Tripolie Administrator",
"email": "admin@tripoliehospital.com",
"role": "admin_institutions",
"institutionId": {
"\_id": "689b28c59439cb29a8b43ca6",
"name": "Tripolie Hospital",
"type": "hospital"
},
"permissions": [
"manage_patients",
"manage_doctors",
"manage_medical_records",
"manage_users",
"manage_roles"
],
"createdAt": "2025-08-12T11:43:45.734Z",
"updatedAt": "2025-08-12T11:43:45.734Z",
"**v": 0
},
{
"\_id": "689b12e1807b34f1829ec664",
"name": "Hospital Administrator",
"email": "admin@cityhospital.com",
"role": "admin_institutions",
"institutionId": {
"\_id": "689b0ffcbaad48dedc2e581f",
"name": "City Hospital",
"type": "hospital"
},
"permissions": [
"manage_patients",
"manage_doctors",
"manage_medical_records",
"manage_users",
"view_statistics",
"manage_roles"
],
"createdAt": "2025-08-12T10:09:37.607Z",
"updatedAt": "2025-08-12T10:09:37.607Z",
"**v": 0
},
{
"\_id": "689b0bd9b60265502e6795d2",
"name": "System Administrator",
"email": "admin@medicalcv.com",
"role": "admin",
"permissions": [
"manage_patients",
"manage_doctors",
"manage_medical_records",
"manage_users",
"view_statistics",
"manage_institutions",
"manage_roles"
],
"createdAt": "2025-08-12T09:39:37.408Z",
"updatedAt": "2025-08-12T09:39:37.408Z",
"\_\_v": 0
}
],
"pagination": {
"currentPage": 1,
"totalPages": 1,
"totalItems": 3,
"itemsPerPage": 10
}
}

## DELETE User:

delete: http://localhost:5500/api/v1/admin/users/689b1d119439cb29a8b43c78
response:
{
"success": true,
"message": "User deleted successfully"
}
use admin token

# admin_institution

## GET patients

get: http://localhost:5500/api/v1/patients
use admin_institution token
response:

## GET patient (ID)

## POST patient (ID)
