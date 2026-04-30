# Railway Deployment Guide

This guide provides step-by-step instructions to deploy the Team Task Manager application on Railway.

## Prerequisites

- Railway.app account (free tier available)
- GitHub account with repository access
- The team-task-manager repository

## Step 1: Create Railway Account & Project

1. Go to [railway.app](https://railway.app)
2. Click "Start New" or sign in
3. Click "Create New Project"
4. Select "Deploy from GitHub"

## Step 2: Connect GitHub Repository

1. Authorize Railway to access your GitHub account
2. Select the `team-task-manager` repository
3. Choose the branch to deploy (usually `main` or `master`)
4. Click "Deploy Now"

## Step 3: Add PostgreSQL Service

Railway will detect the Node.js app. Now add the database:

1. In your Railway project, click "+ Add Plugin"
2. Search for and select "PostgreSQL"
3. Click "Add"
4. Railway will automatically provision a PostgreSQL instance

## Step 4: Configure Environment Variables

### For Backend Service

In Railway dashboard:

1. Click on the "web" service (Node.js app)
2. Go to "Variables" tab
3. Add the following environment variables:

```
NODE_ENV=production
PORT=8080
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
JWT_SECRET=your-very-secure-random-jwt-secret-key-here
FRONTEND_URL=your-frontend-production-domain
```

**Generate secure JWT_SECRET** (use one of these commands):
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32

# Using Python
python3 -c "import secrets; print(secrets.token_hex(32))"
```

## Step 5: Build & Deploy Backend

1. Railway will automatically:
   - Detect the `Procfile`
   - Install dependencies (`npm install`)
   - Run build commands
   - Start the server

2. View logs:
   - Click on the "web" service
   - Go to "Logs" tab to monitor deployment
   - Look for "Server running on port..."

3. Get backend URL:
   - In the service, find the public URL
   - It will look like: `https://team-task-manager-prod-12345.railway.app`
   - Save this URL for frontend configuration

## Step 6: Deploy Frontend Separately

Create a new Railway project for the frontend:

1. In Railway, click "+ New Project"
2. Select "Deploy from GitHub"
3. Select the same repository
4. Once created, Railway will try to deploy

5. Add environment variables:
   - Go to "Variables" tab
   - Add:
     ```
     VITE_API_URL=https://your-backend-railway-domain/api
     VITE_ENV=production
     ```

6. Configure build settings:
   - Go to "Settings" tab
   - Build command: `npm run build`
   - Start command: `npm run start`
   - Root directory: `frontend`

7. Deploy:
   - Click "Deploy"
   - Monitor logs for completion
   - Save the frontend URL when ready

## Step 7: Database Initialization

The database migrations should run automatically on first deployment.

If they don't, you can:

1. Open Railway terminal for the web service
2. Run:
   ```bash
   npm run migrate
   ```

## Step 8: Test the Application

1. Open your frontend URL in browser
2. Create a new account
3. Create a project
4. Add tasks
5. Verify everything works

## Step 9: Domain Configuration (Optional)

To use custom domains:

1. For Backend:
   - Click web service → Settings
   - Add custom domain
   - Point DNS records to Railway

2. For Frontend:
   - Click frontend service → Settings
   - Add custom domain
   - Update `VITE_API_URL` if needed

## Step 10: Monitoring & Maintenance

### View Logs
- Click on service → Logs
- Search for errors or issues

### Monitor Performance
- Check memory and CPU usage
- Scale if needed (paid Railway plans)

### Database Backups
- Railway provides automatic backups (team plans)
- Export backups manually if needed

## Troubleshooting

### Build Fails

**Check logs:**
```bash
- Look in the Railway dashboard logs
- Search for errors
```

**Common issues:**
- Missing environment variables
- Node.js version incompatibility
- Missing dependencies

**Solution:**
1. Add missing variables
2. Update `package.json` with all dependencies
3. Redeploy

### Database Connection Error

- Verify PostgreSQL service is active
- Check environment variable names (case-sensitive)
- Ensure `DB_HOST` matches `${{Postgres.PGHOST}}`

### Frontend Can't Connect to Backend

- Verify backend URL in `VITE_API_URL`
- Check CORS settings in backend
- Ensure backend is running on Railway

### 504 Gateway Timeout

- Backend service is down
- Check logs for crash
- Restart service or redeploy

## Cost Estimation

Railway offers:
- **Free tier**: Limited usage, good for testing
- **Paid ($5+/month)**: Production-grade with more resources

Estimated costs:
- Backend (Node.js): $5-10/month
- PostgreSQL: $7+/month
- Frontend (static): Often free or $5/month

Total: Usually $12-25/month for production

## Security Checklist

- [ ] JWT_SECRET is strong and random
- [ ] Database password is strong
- [ ] FRONTEND_URL is set correctly
- [ ] Environment variables are not exposed
- [ ] SSL/HTTPS is enabled (automatic on Railway)
- [ ] Database backups are enabled
- [ ] Regular monitoring of logs

## Next Steps

1. **Set up monitoring**: Configure alerts for errors
2. **Implement CI/CD**: Auto-deploy on push
3. **Add analytics**: Track user behavior
4. **Set up  backups**: Regular database snapshots
5. **Plan scaling**: Prepare for growth

## Support

- Railway Docs: https://docs.railway.app
- Community: https://discord.gg/railway
- Issues: Check GitHub repository

---

**Your Team Task Manager is now live! 🚀**
