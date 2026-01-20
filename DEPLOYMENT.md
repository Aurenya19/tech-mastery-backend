# 🚀 DEPLOYMENT GUIDE - Tech Mastery Backend

## ONE-TIME SETUP (2 Minutes)

### Step 1: Go to Render.com
```
https://render.com
```

### Step 2: Sign Up / Login
- Click "Get Started for Free"
- Sign up with GitHub (recommended)
- Authorize Render to access your GitHub

### Step 3: Create New Web Service
1. Click "New +" button (top right)
2. Select "Web Service"
3. Connect your GitHub account if not already connected
4. Find and select: **Aurenya19/tech-mastery-backend**

### Step 4: Configure Service
```
Name: tech-mastery-backend
Region: Choose closest to India (Singapore recommended)
Branch: main
Runtime: Node
Build Command: npm install
Start Command: npm start
Plan: Free
```

### Step 5: Deploy!
- Click "Create Web Service"
- Wait 2-3 minutes for deployment
- You'll get a URL like: https://tech-mastery-backend.onrender.com

### Step 6: Test Your Backend
Open in browser:
```
https://tech-mastery-backend.onrender.com/
```

You should see:
```json
{
  "status": "online",
  "message": "🎯 Tech Mastery Lab Backend API",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

### Step 7: Test API Endpoints
```
https://tech-mastery-backend.onrender.com/api/news
https://tech-mastery-backend.onrender.com/api/github
https://tech-mastery-backend.onrender.com/api/reddit
https://tech-mastery-backend.onrender.com/api/research
```

---

## ✅ THAT'S IT!

Your backend is now:
- ✅ Live and running
- ✅ Auto-deploys on every GitHub push
- ✅ Free forever (Render free tier)
- ✅ HTTPS enabled
- ✅ Global CDN

---

## 📝 NEXT STEP

**Copy your Render URL** and share it so I can update the frontend!

Example:
```
https://tech-mastery-backend.onrender.com
```

---

## 🔄 AUTO-DEPLOY

Every time you push to GitHub, Render automatically:
1. Detects the change
2. Rebuilds the backend
3. Deploys new version
4. Zero downtime!

---

## 💡 TROUBLESHOOTING

### Backend not responding?
- Render free tier sleeps after 15 min of inactivity
- First request takes 30-60 seconds to wake up
- Subsequent requests are instant

### Want to keep it always awake?
- Upgrade to paid plan ($7/month)
- Or use a cron job to ping every 10 minutes

---

## 🎯 RENDER DASHBOARD

Monitor your backend:
```
https://dashboard.render.com
```

See:
- Deployment logs
- Request metrics
- Error logs
- Resource usage

---

Made with ❤️ for Tech Mastery Lab 🇮🇳
