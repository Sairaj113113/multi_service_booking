# AI Enabled Multi-Service Booking & Appointment Slot Management System

## Tech Stack
- Java 17, Spring Boot 3.2, Maven
- PostgreSQL, Spring Data JPA
- Spring Security + JWT
- Lombok, Bean Validation

---

## Project Structure

```
src/main/java/com/booking/
├── BookingSystemApplication.java
├── config/
│   └── SecurityConfig.java
├── controller/
│   ├── AdminController.java
│   ├── AuthController.java
│   ├── BookingController.java
│   ├── ServiceController.java
│   └── SlotController.java
├── dto/
│   ├── request/
│   │   ├── BookingRequest.java
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── ServiceRequest.java
│   │   └── SlotRequest.java
│   └── response/
│       ├── AuthResponse.java
│       ├── BookingResponse.java
│       ├── ErrorResponse.java
│       ├── ServiceResponse.java
│       ├── SlotResponse.java
│       └── UserResponse.java
├── entity/
│   ├── Booking.java
│   ├── Service.java
│   ├── Slot.java
│   └── User.java
├── exception/
│   ├── AccessDeniedException.java
│   ├── BadRequestException.java
│   ├── GlobalExceptionHandler.java
│   └── ResourceNotFoundException.java
├── repository/
│   ├── BookingRepository.java
│   ├── ServiceRepository.java
│   ├── SlotRepository.java
│   └── UserRepository.java
├── security/
│   ├── CustomUserDetails.java
│   ├── CustomUserDetailsService.java
│   ├── JwtAuthEntryPoint.java
│   ├── JwtAuthenticationFilter.java
│   └── JwtUtil.java
└── service/
    ├── AdminService.java
    ├── AuthService.java
    ├── BookingService.java
    ├── ServiceService.java
    └── SlotService.java
```

---

## Prerequisites
- Java 17+
- Maven 3.8+
- PostgreSQL 14+

## Setup

### 1. Create the database
```sql
CREATE DATABASE booking_db;
```

### 2. Configure environment variables (or edit application.yml)
```
DB_URL=jdbc:postgresql://localhost:5432/booking_db
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=your-256-bit-secret-key-here-at-least-32-chars
JWT_EXPIRATION_MS=86400000
```

### 3. Build & Run
```bash
mvn clean install
mvn spring-boot:run
```
Server starts at `http://localhost:8080`

---

## API Reference

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login & get JWT |

**Register Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "ROLE_USER"
}
```
Roles: `ROLE_USER`, `ROLE_PROVIDER`, `ROLE_ADMIN`

**Login Body:**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response:**
```json
{
  "token": "eyJhbGci...",
  "type": "Bearer",
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "ROLE_USER"
}
```

### Services

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/services | ROLE_PROVIDER | Create a service |
| GET | /api/services | Public | List all services |
| GET | /api/services/{id} | Public | Get service by ID |

**Create Service Body:**
```json
{
  "name": "Haircut",
  "description": "Professional haircut",
  "price": 25.00,
  "durationMinutes": 30
}
```

### Slots

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/slots | ROLE_PROVIDER | Create a slot |
| GET | /api/slots/service/{serviceId} | Public | All slots for a service |
| GET | /api/slots/service/{serviceId}/available | Public | Available slots only |

**Create Slot Body:**
```json
{
  "serviceId": 1,
  "startTime": "2026-03-01T10:00:00",
  "endTime": "2026-03-01T10:30:00"
}
```

### Bookings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/bookings | ROLE_USER | Book a slot |
| PUT | /api/bookings/{id}/cancel | ROLE_USER | Cancel a booking |
| GET | /api/bookings/my | ROLE_USER | My bookings |

**Book Slot Body:**
```json
{
  "slotId": 1
}
```

### Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/admin/users | ROLE_ADMIN | List all users |

---

## Authentication

All protected endpoints require:
```
Authorization: Bearer <token>
```

---

## Security Model

- Passwords hashed with BCrypt
- JWT contains `email` (subject) + `role` claim
- Stateless session (no server-side sessions)
- Role-based access via Spring `@PreAuthorize`
