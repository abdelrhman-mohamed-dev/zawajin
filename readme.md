# Zawajin - Local Development Setup Guide

This guide will help you set up the Zawajin matrimonial platform on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** (v14 or higher) - [Download here](https://www.postgresql.org/download/)
- **Git** - [Download here](https://git-scm.com/)

---

## Step 1: PostgreSQL Installation & Setup

### Windows

1. **Download PostgreSQL:**
   - Go to [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
   - Download the installer for Windows

2. **Install PostgreSQL:**
   - Run the installer
   - During installation, remember the password you set for the `postgres` user
   - Default port: `5432`
   - Install pgAdmin 4 (GUI tool for managing PostgreSQL)

3. **Create Database:**
   - Open pgAdmin 4 or use the command line

   **Using psql command line:**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres

   # Enter your password when prompted

   # Create database
   CREATE DATABASE zawajin;

   # Create user (optional, or use postgres user)
   CREATE USER zawajin_user WITH PASSWORD 'your_password';

   # Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE zawajin TO zawajin_user;

   # Exit psql
   \q
   ```

### macOS

1. **Install PostgreSQL using Homebrew:**
   ```bash
   brew install postgresql@14
   brew services start postgresql@14
   ```

2. **Create Database:**
   ```bash
   # Connect to PostgreSQL
   psql postgres

   # Create database
   CREATE DATABASE zawajin;

   # Create user (optional)
   CREATE USER zawajin_user WITH PASSWORD 'your_password';

   # Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE zawajin TO zawajin_user;

   # Exit
   \q
   ```

### Linux (Ubuntu/Debian)

1. **Install PostgreSQL:**
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

2. **Create Database:**
   ```bash
   # Switch to postgres user
   sudo -u postgres psql

   # Create database
   CREATE DATABASE zawajin;

   # Create user (optional)
   CREATE USER zawajin_user WITH PASSWORD 'your_password';

   # Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE zawajin TO zawajin_user;

   # Exit
   \q
   ```

---

## Step 2: Clone the Repository

```bash
# Clone the repository
git clone <your-repository-url>
cd source-code

# Or if you already have the folder
cd D:\FR\source-code
```

---

## Step 3: Install Dependencies

```bash
# Install all npm packages with legacy peer deps flag
npm install --legacy-peer-deps
```

**Note:** The `--legacy-peer-deps` flag is required due to peer dependency conflicts between some packages.

---

## Step 4: Environment Configuration

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file with your configuration:**

   ```env
   # Application
   NODE_ENV=development
   PORT=3000

   # Database Configuration
   DB_TYPE=postgres
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_postgres_password
   DB_DATABASE=zawajin
   DB_SYNCHRONIZE=true
   DB_LOGGING=true

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRY=7d
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this

   # Email Configuration (for OTP)
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USER=your-email@gmail.com
   MAIL_PASSWORD=your-app-specific-password
   MAIL_FROM=noreply@zawajin.com

   # OTP Configuration
   OTP_EXPIRY_MINUTES=5
   OTP_LENGTH=6
   MAX_OTP_ATTEMPTS=3

   # Rate Limiting
   RATE_LIMIT_TTL=60000
   RATE_LIMIT_DEFAULT=100
   RATE_LIMIT_REGISTER=5

   # Firebase (Optional - for push notifications)
   FIREBASE_PROJECT_ID=your-firebase-project-id
   FIREBASE_CLIENT_EMAIL=your-firebase-client-email
   FIREBASE_PRIVATE_KEY=your-firebase-private-key
   ```

3. **Gmail Setup for Email OTP (if using Gmail):**
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Enable 2-Factor Authentication
   - Generate an App Password: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Use the generated app password in `MAIL_PASSWORD`

---

## Step 5: Verify Database Connection

```bash
# The database tables will be created automatically when you start the app
# Thanks to TypeORM synchronize feature (only for development)
```

---

## Step 6: Run the Application

### Development Mode (with hot reload)

```bash
npm run start:dev
```

The server will start on `http://localhost:3000`

### Production Build

```bash
# Build the project
npm run build

# Run production server
npm run start:prod
```

### Debug Mode

```bash
npm run start:debug
```

---

## Step 7: Verify Everything is Working

1. **Check the API is running:**
   - Open browser: [http://localhost:3000](http://localhost:3000)
   - You should see a response

2. **Access Swagger Documentation:**
   - Open browser: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
   - You'll see interactive API documentation

3. **Check Health Endpoint:**
   - Open browser: [http://localhost:3000/health](http://localhost:3000/health)
   - Should return: `{"status":"ok"}`

4. **Test Registration:**
   - Use Swagger UI or Postman
   - POST to `/auth/register` with:
   ```json
   {
     "fullName": "Test User",
     "gender": "male",
     "email": "test@example.com",
     "phone": "1234567890",
     "password": "Test123456",
     "confirmPassword": "Test123456"
   }
   ```

---

## Step 8: Database Verification

Check if tables were created:

```bash
# Connect to PostgreSQL
psql -U postgres -d zawajin

# List all tables
\dt

# You should see:
# - users
# - otps (if OTP feature is used)

# View users table structure
\d users

# Exit
\q
```

---

## Common Issues & Troubleshooting

### Issue 1: PostgreSQL Connection Error

**Error:** `password authentication failed for user "postgres"`

**Solution:**
- Verify your password in `.env` matches the PostgreSQL password
- Check PostgreSQL is running: `pg_isready`

### Issue 2: Email OTP Not Sending

**Error:** `Failed to send verification email`

**Solution:**
- Verify Gmail credentials
- Ensure you're using an App Password, not your regular password
- Check `MAIL_HOST` and `MAIL_PORT` settings

### Issue 3: Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
- Change the `PORT` in `.env` to another port (e.g., 3000, 8000)
- Or kill the process using port 3000:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F

  # macOS/Linux
  lsof -ti:3000 | xargs kill -9
  ```

### Issue 4: npm install fails

**Error:** `ERESOLVE could not resolve`

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall with legacy peer deps
npm install --legacy-peer-deps
```

---

## Useful Commands

```bash
# Lint code
npm run lint

# Format code
npm run format

# Run tests
npm run test

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e

# View TypeORM CLI commands
npm run typeorm -- --help
```

---

## Project Structure

```
src/
├── config/              # Configuration files (database, redis, firebase)
├── common/              # Shared utilities, constants, decorators
├── health/              # Health check module
├── modules/
│   ├── auth/            # Authentication & user management
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── guards/
│   │   └── strategies/
│   ├── users/           # User profile management
│   │   ├── controllers/
│   │   ├── services/
│   │   └── dto/
│   ├── mail/            # Email service
│   └── notifications/   # Push notifications
├── app.module.ts        # Root module
└── main.ts              # Application entry point
```

---

## Next Steps

1. Read [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for push notifications setup
2. Import [zawajin.json](./zawajin.json) into Postman for API testing

---

## Support

For issues or questions, please refer to:
- Create an issue in the repository

---

**Happy Coding! 🚀**
