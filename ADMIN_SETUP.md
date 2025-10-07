# Admin Dashboard Setup Guide

This guide explains how to set up and use the admin dashboard for Zawaj-In matrimonial platform.

## Table of Contents
- [Initial Setup](#initial-setup)
- [Creating Super Admin](#creating-super-admin)
- [Admin Roles & Permissions](#admin-roles--permissions)
- [Using the Admin API](#using-the-admin-api)
- [Security Best Practices](#security-best-practices)

---

## Initial Setup

### 1. Configure Environment Variables

Add the following to your `.env` file:

```env
# Admin Configuration
SUPER_ADMIN_EMAIL=superadmin@zawaj.in
SUPER_ADMIN_PASSWORD=SuperAdmin@123
SUPER_ADMIN_FULL_NAME=Super Administrator
SUPER_ADMIN_PHONE=+1234567890
SUPER_ADMIN_GENDER=male
```

⚠️ **Important**: Change these default values, especially in production!

### 2. Run Database Migrations

Make sure your database is up to date:

```bash
npm run build
npm run start:dev
```

The application will automatically sync the database schema if `DB_SYNCHRONIZE=true` in your `.env` file.

### 3. Seed the Super Admin

Run the seed script to create the super admin user:

```bash
npm run seed
```

This will create:
- ✅ Super admin user with credentials from `.env`
- ✅ All subscription plans (Free, Basic, Premium, Gold)

You should see output like:
```
🌱 Starting database seeding...

1️⃣ Seeding super admin user...
✅ Super admin created successfully!
📧 Email: superadmin@zawaj.in
🔑 Password: SuperAdmin@123
⚠️  Please change the password after first login!

2️⃣ Seeding subscription plans...
✅ Subscription plans seeded successfully!

✅ All seeds completed successfully!
```

---

## Creating Super Admin

### Method 1: Using Seed Script (Recommended)

```bash
npm run seed
```

### Method 2: Manual Database Update

If you need to promote an existing user to super admin:

```sql
UPDATE users
SET
  role = 'super_admin',
  permissions = NULL,
  is_email_verified = true,
  is_verified = true,
  verified_at = NOW(),
  role_assigned_at = NOW()
WHERE email = 'user@example.com';
```

---

## Admin Roles & Permissions

### Role Hierarchy

```
super_admin > admin > user
```

### Roles

1. **Super Admin** (`super_admin`)
   - Has ALL permissions automatically
   - Can create/manage other admins
   - Can promote/demote admins
   - Cannot be banned or deleted by other admins

2. **Admin** (`admin`)
   - Has permissions based on assigned permissions array
   - Cannot modify other admins
   - Can be managed by super admins only

3. **User** (`user`)
   - Regular platform user
   - No admin access

### Available Permissions

- `manage_users` - Ban, unban, edit, delete users
- `manage_reports` - View and resolve user reports
- `manage_subscriptions` - Create/edit subscription plans
- `view_analytics` - Access analytics dashboard
- `send_notifications` - Send emails/notifications to users
- `verify_users` - Manually verify user profiles

---

## Using the Admin API

### 1. Login as Super Admin

**Endpoint:** `POST /auth/login`

```json
{
  "email": "superadmin@zawaj.in",
  "password": "SuperAdmin@123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "superadmin@zawaj.in",
      "role": "super_admin",
      "permissions": null
    }
  }
}
```

### 2. Use the Token in Requests

Add the JWT token to all admin API requests:

```
Authorization: Bearer <your-token>
```

### 3. Common Admin Operations

#### Create a New Admin

**Endpoint:** `POST /admin/admins` (Super Admin Only)

```json
{
  "fullName": "John Admin",
  "email": "admin@zawaj.in",
  "phone": "+1234567890",
  "gender": "male",
  "password": "Admin@123",
  "permissions": ["manage_users", "manage_reports", "view_analytics"]
}
```

#### Ban a User

**Endpoint:** `POST /admin/users/:userId/ban`

```json
{
  "banType": "temporary",
  "reason": "Violating community guidelines",
  "bannedUntil": "2025-12-31T23:59:59.000Z"
}
```

#### View Analytics

**Endpoint:** `GET /admin/analytics/overview`

Returns dashboard overview with:
- Total users
- Active users
- New users (last 30 days)
- Active subscriptions

---

## Security Best Practices

### 1. Change Default Password

Immediately after first login, change the super admin password:

**Endpoint:** `POST /auth/reset-password`

### 2. Use Strong Passwords

Admin passwords should:
- Be at least 12 characters long
- Include uppercase, lowercase, numbers, and symbols
- Not be reused from other accounts
- Be changed regularly (every 90 days)

### 3. Limit Admin Access

- Only create admin accounts when absolutely necessary
- Assign minimal required permissions
- Regularly audit admin accounts
- Remove admin access when no longer needed

### 4. Enable Audit Logging

All admin actions are logged in the `admin_actions` table:
- What action was taken
- Who performed it
- When it occurred
- Why it was done
- Additional metadata

Monitor these logs regularly for suspicious activity.

### 5. IP Restrictions (Future)

In production, consider restricting admin access to specific IP addresses or VPN.

### 6. Two-Factor Authentication (Future)

Implement 2FA for all admin accounts for additional security.

---

## Admin API Endpoints

### User Management
- `GET /admin/users` - List all users
- `GET /admin/users/:id` - Get user details
- `PUT /admin/users/:id` - Update user
- `POST /admin/users/:id/ban` - Ban user
- `POST /admin/users/:id/unban` - Unban user
- `DELETE /admin/users/:id` - Delete user
- `POST /admin/users/:id/verify` - Verify user
- `POST /admin/users/:id/send-notification` - Send notification
- `GET /admin/users/:id/activity-logs` - Get activity logs

### Admin Management (Super Admin Only)
- `GET /admin/admins` - List all admins
- `POST /admin/admins` - Create admin
- `PUT /admin/admins/:id/roles` - Update permissions
- `PUT /admin/admins/:id/promote` - Promote to super admin
- `PUT /admin/admins/:id/demote` - Demote to admin
- `DELETE /admin/admins/:id` - Remove admin privileges

### Reports Management
- `GET /admin/reports` - List all reports
- `GET /admin/reports/:id` - Get report details
- `PUT /admin/reports/:id/review` - Mark as reviewed
- `PUT /admin/reports/:id/resolve` - Resolve report
- `PUT /admin/reports/:id/dismiss` - Dismiss report

### Analytics
- `GET /admin/analytics/overview` - Dashboard overview
- `GET /admin/analytics/users` - User analytics
- `GET /admin/analytics/matches` - Match analytics
- `GET /admin/analytics/messages` - Message analytics
- `GET /admin/analytics/subscriptions` - Subscription analytics

### Subscription Management
- `GET /admin/subscriptions/plans` - List plans
- `GET /admin/subscriptions` - List subscriptions

---

## Troubleshooting

### Cannot Login as Super Admin

1. Verify the user exists in database:
   ```sql
   SELECT id, email, role FROM users WHERE email = 'superadmin@zawaj.in';
   ```

2. Check if email is verified:
   ```sql
   SELECT is_email_verified FROM users WHERE email = 'superadmin@zawaj.in';
   ```

3. Reset password manually if needed:
   ```bash
   npm run seed  # This will re-create the super admin
   ```

### Permission Denied Errors

1. Check user role:
   ```sql
   SELECT role, permissions FROM users WHERE email = 'your-email@example.com';
   ```

2. Verify JWT token is valid and not expired

3. Ensure you're using the correct bearer token format in headers

### Seed Script Fails

1. Ensure database is running and accessible
2. Check database connection settings in `.env`
3. Verify all migrations have run
4. Check for unique constraint violations (super admin email already exists)

---

## Need Help?

For additional support or questions:
- Check the main [README.md](./README.md)
- Review [plan.md](./plan.md) for implementation details
- Check API documentation at `/api/docs` (Swagger UI)

---

**Last Updated:** 2025-10-07
**Version:** Phase 5 Part B Complete
