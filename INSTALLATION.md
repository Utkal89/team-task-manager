# Installation & Setup Guide

Complete step-by-step guide to set up and run the Team Task Manager locally.

## System Requirements

### Minimum
- **CPU**: 2 cores
- **RAM**: 2GB minimum
- **Storage**: 500MB free space
- **Node.js**: v14.0.0 or higher
- **PostgreSQL**: v12 or higher

### Recommended
- **CPU**: 4+ cores
- **RAM**: 4GB+
- **Storage**: 2GB+ free space
- **Node.js**: v18 LTS
- **PostgreSQL**: v14 or higher

## Operating Systems

✅ **Tested on:**
- macOS 12+
- Ubuntu 20.04 LTS+
- Windows 10/11 (with WSL2 recommended)

## Installation Steps

### Step 1: Install Prerequisites

#### Node.js

**macOS (using Homebrew):**
```bash
brew install node
```

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Windows:**
- Download from https://nodejs.org
- Run installer
- Verify installation:
  ```
  node --version
  npm --version
  ```

#### PostgreSQL

**macOS (using Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
- Download from https://www.postgresql.org/download/windows/
- Run installer
- Remember the password for `postgres` user
- Start PostgreSQL service from Windows Services

#### Git

**macOS:**
```bash
brew install git
```

**Ubuntu/Debian:**
```bash
sudo apt-get install git
```

**Windows:**
- Download from https://git-scm.com
- Run installer

### Step 2: Clone the Repository

```bash
cd ~/projects  # or your preferred directory
git clone https://github.com/yourusername/team-task-manager.git
cd team-task-manager
```

### Step 3: Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

This will install all required packages:
- express (web framework)
- pg (PostgreSQL client)
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)
- cors (cross-origin requests)
- express-validator (input validation)

#### Create Database

Open PostgreSQL interactive terminal:

**macOS/Linux:**
```bash
psql postgres
```

**Windows (if psql not in PATH):**
```bash
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres
```

In PostgreSQL prompt:
```sql
CREATE DATABASE team_task_manager;
\q  -- exit
```

#### Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=team_task_manager
DB_USER=postgres
DB_PASSWORD=postgres  # Change if you set a different password

# JWT
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:3000
```

#### Run Migrations

```bash
npm run migrate
```

You should see:
```
✅ Database setup completed successfully
```

This creates these tables:
- users
- projects
- team_members
- tasks

#### Verify Backend Setup

```bash
npm run dev
```

You should see:
```
✅ Database initialized
🚀 Server running on port 5000
```

Keep this terminal running. Press `Ctrl+C` to stop.

### Step 4: Frontend Setup

Open a new terminal:

```bash
cd frontend  # From project root
npm install
```

This installs:
- react (UI framework)
- react-router-dom (routing)
- axios (HTTP client)
- zustand (state management)
- vite (build tool)

#### Create Environment Config (Optional)

Create `frontend/.env` (optional):

```env
VITE_API_URL=http://localhost:5000/api
VITE_ENV=development
```

#### Start Development Server

```bash
npm run dev
```

You should see:
```
  VITE v4.1.0  Local: http://localhost:3000/
```

## Verification

### Test Backend

Open browser or terminal:

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status":"ok"}
```

### Test Frontend

- Open http://localhost:3000
- You should see login page
- Try signing up with test account

### Full Test Flow

1. **Sign Up:**
   - Email: test@example.com
   - Password: testpass123
   - Name: Test User

2. **Create Project:**
   - Name: "My First Project"
   - Description: "Test description"

3. **Create Task:**
   - Title: "Test Task"
   - Status: TODO
   - Priority: MEDIUM

4. **Update Task:**
   - Change status to DONE

## Database Commands

### Connect to Database

```bash
psql -U postgres -d team_task_manager
```

### View Tables

```sql
\dt  -- list all tables
\d users  -- describe users table
```

### Query Data

```sql
SELECT * FROM users;
SELECT * FROM projects;
SELECT * FROM tasks;
```

### Reset Database

```bash
cd backend
npm run migrate
```

Or manually:
```sql
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

Then run migrations again.

## Stopping Services

### Backend
Press `Ctrl+C` in the backend terminal

### Frontend
Press `Ctrl+C` in the frontend terminal

### PostgreSQL

**macOS:**
```bash
brew services stop postgresql
```

**Ubuntu:**
```bash
sudo systemctl stop postgresql
```

**Windows:**
- Services app → PostgreSQL → Stop

## Building for Production

### Frontend Build

```bash
cd frontend
npm run build
```

Creates optimized build in `frontend/dist/`

### Backend Production

```bash
cd backend
npm start  # Instead of npm run dev
```

## Troubleshooting

### Port Already in Use

**Backend (5000):**
```bash
# Find process using port 5000
lsof -i :5000
# Kill it
kill -9 <PID>

# Or change port in .env
PORT=5001
```

**Frontend (3000):**
```bash
# Find process using port 3000
lsof -i :3000
# Kill it
kill -9 <PID>

# Or run on different port
npm run dev -- --port 3001
```

### PostgreSQL Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
1. Check PostgreSQL is running
2. Check credentials in .env
3. Check database exists:
   ```sql
   \l  -- list databases
   ```

### Module Not Found

```
Cannot find module 'express'
```

**Solution:**
```bash
# In backend or frontend directory
rm -rf node_modules package-lock.json
npm install
```

### CORS Error in Browser

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
1. Check FRONTEND_URL in backend .env
2. Check frontend API URL matches backend

### Database Already Exists

```
CREATE DATABASE failed - database already exists
```

**Solution:**
```bash
npm run migrate  # Re-creates tables
```

## Next Steps

1. **Understand the codebase:**
   - Read [README.md](./README.md)
   - Check [API_REFERENCE.md](./API_REFERENCE.md)

2. **Customize:**
   - Add your company logo
   - Update color scheme in CSS
   - Modify database fields

3. **Deploy:**
   - Follow [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)

4. **Scale:**
   - Add more features
   - Improve UI/UX
   - Implement notifications
   - Add file uploads

## Getting Help

- Check logs for errors
- Review documentation
- Check GitHub issues
- Ask in community forums

---

**You're all set! Happy coding! 🚀**
