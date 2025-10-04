# User Registration & Email OTP Verification System

## Project Overview
Backend implementation for user registration with email OTP verification using NestJS, TypeScript, and TypeORM. Following clean architecture principles with Controller → Service → Repository pattern.

## Tech Stack
- NestJS with TypeScript
- TypeORM for database operations
- PostgreSQL database
- Nodemailer for email sending
- Swagger for API documentation
- Rate limiting with @nestjs/throttler
- Class-validator for DTO validation
- Bcrypt for password hashing

## Project Structure
```
src/
├── modules/
│   ├── auth/
│   │   ├── controllers/
│   │   │   └── auth.controller.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── otp.service.ts
│   │   ├── repositories/
│   │   │   ├── user.repository.ts
│   │   │   └── otp.repository.ts
│   │   ├── entities/
│   │   │   ├── user.entity.ts
│   │   │   └── otp.entity.ts
│   │   ├── dto/
│   │   │   ├── register.dto.ts
│   │   │   ├── verify-otp.dto.ts
│   │   │   └── resend-otp.dto.ts
│   │   ├── interfaces/
│   │   │   └── auth.interface.ts
│   │   └── auth.module.ts
│   ├── mail/
│   │   ├── services/
│   │   │   └── mail.service.ts
│   │   └── mail.module.ts
├── common/
│   ├── constants/
│   │   └── app.constants.ts
│   ├── exceptions/
│   │   └── business.exception.ts
│   └── decorators/
│       └── rate-limit.decorator.ts
└── config/
    └── database.config.ts
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE,
    phone_country_code VARCHAR(5),
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

### OTP Codes Table
```sql
CREATE TABLE otp_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    code VARCHAR(6) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'EMAIL' or 'PHONE'
    expires_at TIMESTAMP NOT NULL,
    attempts INTEGER DEFAULT 0,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_otp_user_type ON otp_codes(user_id, type);
CREATE INDEX idx_otp_expires ON otp_codes(expires_at);
```

## Implementation Requirements

### 1. User Entity (user.entity.ts)
- Use TypeORM decorators
- UUID primary key
- Proper column types and constraints
- Timestamps with @CreateDateColumn and @UpdateDateColumn
- No relations loading by default

### 2. OTP Entity (otp.entity.ts)
- Link to User entity with ManyToOne
- Enum for OTP type (EMAIL/PHONE)
- Expiration timestamp
- Attempt counter for security

### 3. Register DTO (register.dto.ts)
- Class-validator decorators
- @ApiProperty for Swagger documentation
- Custom validation messages in Arabic and English
- Validate:
  - Email format
  - Username (alphanumeric, 3-20 chars)
  - Password strength (min 8 chars, uppercase, lowercase, number)
  - Phone with country code

### 4. Auth Controller (auth.controller.ts)
- Clean REST endpoints
- Swagger decorators for each endpoint
- Rate limiting per endpoint
- Proper HTTP status codes
- Error handling with try-catch

Endpoints:
- POST /auth/register - Register new user
- POST /auth/verify-email - Verify email with OTP
- POST /auth/resend-otp - Resend OTP code

### 5. Auth Service (auth.service.ts)
- No method chaining
- Clear variable names
- Single responsibility per method
- Proper error messages
- Business logic validation

Methods:
```typescript
async register(dto: RegisterDto): Promise<RegisterResponse>
async verifyEmailOtp(email: string, code: string): Promise<VerifyResponse>
async resendOtp(email: string): Promise<ResendResponse>
```

### 6. OTP Service (otp.service.ts)
- Generate 6-digit random OTP
- Set expiration (5 minutes)
- Validate OTP with attempts limit (3 max)
- Mark as used after verification
- Clean expired OTPs (scheduled job)

### 7. Repositories
- Clean TypeORM methods
- No complex queries
- Simple CRUD operations
- Proper error handling
- Transaction support where needed

### 8. Mail Service
- HTML email template for OTP
- Arabic/English support
- Queue implementation for reliability
- Retry mechanism
- Email delivery status tracking

### 9. Rate Limiting
- Register: 5 requests per hour per IP
- Verify OTP: 10 requests per hour per IP
- Resend OTP: 3 requests per hour per email

### 10. Security Considerations
- Hash passwords with bcrypt (12 rounds)
- OTP expires in 5 minutes
- Maximum 3 verification attempts
- Block user after 5 failed login attempts
- Sanitize all inputs
- No sensitive data in responses

### 11. API Response Format
```json
{
  "success": true,
  "message": "Success message",
  "data": {},
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### 12. Error Response Format
```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": []
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### 13. Swagger Documentation
- Complete request/response examples
- Error scenarios documented
- Arabic descriptions where needed
- Authentication headers
- Rate limit information

### 14. Environment Variables
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=user
DATABASE_PASSWORD=password
DATABASE_NAME=zawaj_db

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=noreply@zawaj.com
MAIL_PASSWORD=password
MAIL_FROM=Zawaj <noreply@zawaj.com>

OTP_EXPIRY_MINUTES=5
OTP_LENGTH=6
MAX_OTP_ATTEMPTS=3

JWT_SECRET=your-secret-key
JWT_EXPIRY=7d

RATE_LIMIT_TTL=3600
RATE_LIMIT_REGISTER=5
RATE_LIMIT_OTP_VERIFY=10
RATE_LIMIT_OTP_RESEND=3
```

## Code Generation Instructions

1. Start with entities and database setup
2. Create DTOs with proper validation
3. Implement repositories with simple methods
4. Build services with clean business logic
5. Create controllers with Swagger documentation
6. Add mail service for OTP sending
7. Implement rate limiting
8. Add comprehensive error handling
9. Write unit tests for services
10. Add integration tests for controllers

## Important Notes
- No use of `any` type anywhere in the code
- All methods should have explicit return types
- Use dependency injection properly
- Implement logging for debugging
- Add database transactions where needed
- Follow NestJS best practices
- Use async/await instead of promises
- Proper error messages in Arabic and English

## Example Swagger Documentation
Each endpoint should have:
- Summary and description
- Request body examples
- Success response examples
- Error response examples
- Rate limit information
- Authentication requirements

Generate clean, production-ready code following these specifications exactly.
