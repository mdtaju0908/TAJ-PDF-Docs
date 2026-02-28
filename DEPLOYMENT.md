# Smart PDF Tools - Deployment Guide

This guide covers the complete deployment process for the Smart PDF Tools full-stack application.

## Project Structure

```
TAJ PDF Docs/
├── backend/                 # FastAPI backend
│   ├── app/                # Application code
│   ├── requirements.txt   # Python dependencies
│   ├── Procfile           # Render deployment config
│   └── .env.example       # Environment variables template
├── frontend/               # Next.js frontend
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── lib/               # Utilities and API client
│   ├── vercel.json        # Vercel deployment config
│   └── package.json      # Node.js dependencies
├── .gitignore             # Git ignore rules
├── .env.example           # Combined environment template
└── DEPLOYMENT.md         # This guide
```

## 1. GitHub Setup

### Initialize Git Repository
```bash
# Navigate to project root
cd TAJ-PDF-Docs

# Initialize git
git init

# Add all files
git add .

# Commit initial version
git commit -m "Initial commit: Smart PDF Tools application"

# Create GitHub repository and push
# (Replace with your GitHub repository URL)
git remote add origin https://github.com/your-username/smart-pdf-tools.git
git branch -M main
git push -u origin main
```

## 2. Backend Deployment (Render)

### Prerequisites
- Render account
- AWS account with S3 bucket
- AWS IAM user with S3 permissions

### Deployment Steps

1. **Connect GitHub to Render**
   - Go to [render.com](https://render.com)
   - Connect your GitHub account
   - Import repository

2. **Create Web Service**
   - Service Type: Web Service
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Python Version: 3.11+

3. **Environment Variables (Render Dashboard)**
   ```
   API_KEYS=your-production-api-key
   ALLOWED_ORIGINS=https://your-frontend.vercel.app
   RATE_LIMIT_REQUESTS_PER_MINUTE=60
   
   # AWS Configuration
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=your-s3-bucket-name
   AWS_S3_PREFIX=processed/
   AWS_ACCESS_KEY_ID=your-aws-access-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret-key
   ```

4. **Advanced Settings**
   - Auto-Deploy: Enable from main branch
   - Plan: Starter or higher (for better performance)

## 3. Frontend Deployment (Vercel)

### Prerequisites
- Vercel account
- Backend URL from Render deployment

### Deployment Steps

1. **Connect GitHub to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import project from GitHub
   - Select the frontend directory

2. **Configure Project**
   - Framework: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next` (default)

3. **Environment Variables (Vercel Dashboard)**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
   ```

4. **Deploy**
   - Vercel will automatically deploy on every push to main branch

## 4. Environment Configuration

### Local Development (.env)
```bash
# Backend
API_KEYS=local-dev-key
ALLOWED_ORIGINS=http://localhost:3000
RATE_LIMIT_REQUESTS_PER_MINUTE=1000
TMP_DIR=./backend/tmp

# AWS (use localstack or real AWS for development)
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-dev-bucket
AWS_ACCESS_KEY_ID=your-dev-access-key
AWS_SECRET_ACCESS_KEY=your-dev-secret-key

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Production Environment
- **Render**: Set environment variables in dashboard
- **Vercel**: Set environment variables in project settings

## 5. CORS Configuration

The backend is configured with proper CORS settings:

```python
# app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,  # From environment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Production CORS Settings:**
- Set `ALLOWED_ORIGINS` to your Vercel frontend URL
- Example: `https://your-app.vercel.app`

## 6. Security Considerations

1. **API Keys**: Use different keys for development and production
2. **AWS Credentials**: Never commit actual credentials to git
3. **CORS**: Restrict origins in production to your frontend domain
4. **Rate Limiting**: Adjust based on your expected traffic
5. **HTTPS**: Both Render and Vercel provide HTTPS by default

## 7. Testing Deployment

### Backend Health Check
```bash
curl https://your-backend.onrender.com/health
# Should return: {"status": "ok"}
```

### Frontend API Connection
1. Open your Vercel deployment
2. Check browser console for any CORS errors
3. Test file upload functionality

### S3 Integration Test
1. Upload a PDF file through the frontend
2. Verify it appears in your S3 bucket
3. Check processing functionality works

## 8. Troubleshooting

### Common Issues

1. **CORS Errors**: Verify `ALLOWED_ORIGINS` includes your frontend URL
2. **S3 Permissions**: Check AWS IAM user has proper S3 permissions
3. **Build Failures**: Check Python/Node version compatibility
4. **Environment Variables**: Ensure all required variables are set

### Logs
- **Render**: View logs in Render dashboard
- **Vercel**: View logs in Vercel dashboard
- **AWS**: Check CloudWatch logs for S3 access issues

## 9. Maintenance

### Updates
1. Make changes locally
2. Test thoroughly
3. Push to GitHub
4. Render and Vercel will auto-deploy

### Monitoring
- Monitor Render and Vercel dashboards for errors
- Set up error tracking (Sentry, etc.)
- Monitor S3 costs and usage

### Backup
- Regular database backups (if using database)
- S3 bucket versioning enabled
- GitHub repository as code backup

## Support

For issues with deployment, check:
1. Render documentation: https://render.com/docs
2. Vercel documentation: https://vercel.com/docs
3. AWS S3 documentation: https://docs.aws.amazon.com/s3
4. FastAPI documentation: https://fastapi.tiangolo.com
5. Next.js documentation: https://nextjs.org/docs