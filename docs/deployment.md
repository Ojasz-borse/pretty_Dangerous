# KrishiSetu Deployment Guide

This guide will help you deploy the KrishiSetu application permanently for **FREE** using modern cloud infrastructure.

---

## 📋 Prerequisites

1. A GitHub account
2. A [Vercel account](https://vercel.com) (for Frontend)
3. A [Render account](https://render.com) (for Backend)

---

## 🔧 Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Configure KrishiSetu for production"
git remote add origin https://github.com/YOUR_USERNAME/KrishiSetu.git
git push -u origin main
```

---

## 🚀 Step 2: Deploy Backend on Render (FREE)

### 2.2 Create New Web Service
1. Link your GitHub repository.
2. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `krishisetu-api` |
| **Root Directory** | `mandi-mcp` |
| **Runtime** | Python 3 |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn api:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | Free |

### 2.3 Add Environment Variables
Add these in the Render "Environment" tab:

| Key | Value |
|-----|-------|
| `GEMINI_API_KEY` | (Your Google AI Studio Key) |
| `DATA_GOV_API_KEY` | (Your India Open Data Portal Key) |

---

## 🌐 Step 3: Deploy Frontend on Vercel (FREE)

### 3.2 Import Project
Vercel will auto-detect the Vite/React configuration in the root.

### 3.4 Add Environment Variables
Add these in Vercel "Environment Variables":

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://krishisetu-api.onrender.com` (Your Render URL) |
| `VITE_GEMINI_API_KEY` | (Your Google AI Studio Key) |

---

## ✅ Step 4: Verification

1. Open your Vercel URL.
2. Verify the **Mandi Intelligence Dashboard** loads live data.
3. Check **AI Profit Simulator** for scenario results.

---

## ⚠️ Free Tier Notes

**Cold Starts**: Render's free tier sleeps after 15 mins. The first request after a break may take 30 seconds to wake up the backend.

**Logistics**: Both platforms auto-redeploy when you push to the `main` branch.
