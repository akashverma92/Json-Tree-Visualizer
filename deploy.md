# Deployment Guide

## Quick Deploy to Vercel

### Step 1: Prepare the Project
```bash
# Install dependencies
npm install

# Test the build
npm run vercel-build

# Check if dist folder is created
ls dist/
```

### Step 2: Push to GitHub
```bash
# Add all files
git add .

# Commit changes
git commit -m "Prepare for Vercel deployment"

# Push to main branch
git push origin main
```

### Step 3: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect the configuration from `vercel.json`
6. Click "Deploy"

### Step 4: Verify Deployment
- Your app will be available at `https://your-project-name.vercel.app`
- Test all functionality:
  - JSON input and validation
  - Tree visualization
  - Search functionality
  - Theme toggle
  - Download feature

## Build Configuration
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node.js Version**: 20.x (auto-detected)

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure TypeScript compilation passes: `npm run check`
- Verify Vite build works: `npm run build:client`

### Runtime Errors
- Check Vercel function logs
- Ensure all imports are correct
- Verify static file serving

### Performance Issues
- The bundle is large (534KB) - consider code splitting
- All features work but optimization can be added later

## Environment Variables
No environment variables are required for this project.

## Success Criteria
✅ Build completes without errors  
✅ All static assets are generated  
✅ Server bundle is created  
✅ Vercel deployment succeeds  
✅ App loads and functions correctly  
