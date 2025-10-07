# Database Seeding Guide

This directory contains comprehensive seed data for testing the Zawaj-In platform.

## What Gets Seeded

### 1. Super Admin User
- **Email:** From `.env` (default: `superadmin@zawaj.in`)
- **Password:** From `.env` (default: `SuperAdmin@123`)
- **Role:** `super_admin`
- **Status:** Fully verified and active

### 2. Subscription Plans (4 Plans)
- **Free Plan** - $0/month
- **Basic Plan** - $9.99/month, $99.99/year
- **Premium Plan** - $19.99/month, $199.99/year
- **Gold Plan** - $29.99/month, $299.99/year

### 3. Test Users (15 Users)

#### Male Users (8)
1. **Ahmed Hassan** - 28, Software Engineer, Dubai, Religious, Single
2. **Omar Abdullah** - 32, Doctor, Abu Dhabi, Religious, Divorced
3. **Khalid Rahman** - 30, Business Owner, Dubai, Moderate, Single
4. **Yusuf Ali** - 35, Teacher, Sharjah, Religious, Widowed
5. **Ibrahim Mahmoud** - 27, Engineer, Dubai, Moderate, Single
6. **Hassan Khalil** - 33, Accountant, Ajman, Moderate, Single
7. **Mustafa Tariq** - 36, Architect, Dubai, Moderate, Divorced

#### Female Users (7)
1. **Fatima Zahra** - 25, Student, Dubai, Religious, Single
2. **Aisha Mohammed** - 29, Pharmacist, Dubai, Religious, Single
3. **Maryam Ahmed** - 31, Designer, Abu Dhabi, Moderate, Divorced
4. **Khadija Yusuf** - 26, Marketing Specialist, Dubai, Religious, Single
5. **Sara Ibrahim** - 28, Nurse, Sharjah, Religious, Single
6. **Layla Hassan** - 30, Entrepreneur, Dubai, Moderate, Single
7. **Zainab Ali** - 27, Teacher, Dubai, Religious, Single
8. **Nadia Omar** - 24, Analyst, Dubai, Religious, Single

**Password for all test users:** `Test@123`

### 4. Matching Preferences
Preferences are created for 8 active users with diverse criteria:
- Age range preferences
- Location preferences
- Religious practice preferences
- Marital status preferences
- Profession preferences
- Custom importance weights

### 5. Likes & Matches

#### Mutual Matches (4 pairs)
1. **Ahmed Hassan** ↔ **Fatima Zahra**
2. **Omar Abdullah** ↔ **Maryam Ahmed**
3. **Khalid Rahman** ↔ **Khadija Yusuf**
4. **Ibrahim Mahmoud** ↔ **Nadia Omar**

#### One-Way Likes (6)
- Aisha → Ahmed
- Sara → Yusuf
- Hassan → Layla
- Zainab → Ibrahim
- Mustafa → Aisha
- Yusuf → Sara (will create match with Sara's like)

### 6. Conversations & Messages
4 conversations with realistic message exchanges between matched users:
- Each conversation has 2-4 messages
- Messages include proper Islamic greetings
- Messages are marked as read
- Last message preview updated

## How to Run Seeds

### Method 1: NPM Script (Recommended)
```bash
npm run seed
```

### Method 2: Direct TypeScript Execution
```bash
npx ts-node src/database/seeds/seed.ts
```

### Method 3: Via API Endpoint (Development Only)
```bash
GET http://localhost:5000/api/seed
```

## Environment Variables Required

Make sure these are set in your `.env` file:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=zawaj_in

# Super Admin (Optional - has defaults)
SUPER_ADMIN_EMAIL=superadmin@zawaj.in
SUPER_ADMIN_PASSWORD=SuperAdmin@123
SUPER_ADMIN_FULL_NAME=Super Administrator
SUPER_ADMIN_PHONE=+1234567890
SUPER_ADMIN_GENDER=male
```

## Seed Files Structure

```
seeds/
├── seed.ts                           # Main seed orchestrator
├── seed.module.ts                    # NestJS module for seed endpoint
├── seed.controller.ts                # HTTP endpoint for seeding
├── super-admin.seed.ts              # Super admin user
├── subscription-plans.seed.ts       # Subscription plans
├── users.seed.ts                    # Test users
├── matching-preferences.seed.ts     # User matching preferences
├── likes.seed.ts                    # Likes and matches
├── conversations.seed.ts            # Conversations and messages
└── README.md                        # This file
```

## Testing Scenarios

After seeding, you can test:

### 1. Authentication
- Login as any test user with password: `Test@123`
- Login as super admin with configured credentials

### 2. User Profiles
- Browse users via `GET /users`
- View individual profiles
- Update profiles

### 3. Matching Algorithm
- Set preferences via `PUT /matching/preferences`
- Get recommendations via `GET /matching/recommendations`
- Test compatibility scoring with different filters

### 4. Likes & Matches
- Send likes to users
- View mutual matches
- Test like/unlike functionality

### 5. Chat & Messaging
- View conversations for matched users
- Send messages via REST API or WebSocket
- Test real-time messaging features

### 6. Admin Features (Login as Super Admin)
- View all users
- Manage user accounts
- View analytics
- Handle reports
- Manage subscriptions

## Sample API Calls

### Login as Test User
```bash
POST /auth/login
{
  "email": "ahmed.hassan@example.com",
  "password": "Test@123"
}
```

### Get Match Recommendations
```bash
GET /matching/recommendations?page=1&limit=10&minCompatibilityScore=60
Authorization: Bearer {token}
```

### View Conversations
```bash
GET /chat/conversations
Authorization: Bearer {token}
```

## Re-running Seeds

The seed scripts are idempotent - they check for existing data before creating:
- Existing super admin: Skipped
- Existing subscription plans: Skipped
- Existing users: Skipped
- Existing preferences: Skipped
- Existing likes: Skipped

You can safely run the seed command multiple times.

## Clearing Seed Data

To clear all seed data and start fresh:

```sql
-- WARNING: This will delete ALL data
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE subscription_plans CASCADE;
```

Or drop and recreate the database:

```bash
# PostgreSQL
dropdb zawaj_in
createdb zawaj_in

# Then run seeds again
npm run seed
```

## Notes

- All users are **verified and active** by default for easy testing
- Passwords are properly hashed using bcrypt (12 rounds)
- Chart numbers are auto-generated for each user
- Mutual matches automatically create conversation eligibility
- Messages include realistic Islamic greetings and conversations
- Matching preferences reflect diverse preferences for testing algorithm

## Troubleshooting

### Connection Errors
- Check PostgreSQL is running
- Verify `.env` database credentials
- Ensure database exists

### Duplicate Key Errors
- Seeds are idempotent, but if you see errors:
- Check if data already exists
- Manually remove conflicting records

### Missing Entities
- Ensure all entity files are in `src/**/*.entity.ts`
- Run `npm run build` before seeding

## Next Steps After Seeding

1. Start the development server: `npm run start:dev`
2. Access Swagger docs: `http://localhost:5000/api/docs`
3. Import Postman collection: `zawajin.json`
4. Login as test users and explore features
5. Test matching algorithm with different preferences
6. Test real-time chat features
7. Login as super admin to test admin panel
