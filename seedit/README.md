# Seedit E-Learning Platform

![Seedit Banner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

## Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: [https://ai.studio/apps/temp/3](https://ai.studio/apps/temp/3)

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set up your OpenAI API key in [.env](.env):

   - Get an API key from [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Add it as `VITE_OPENAI_API_KEY=your_key_here`
3. Run the app:
   `npm run dev`

   **Note:** If port 5173 is already in use, you can specify a different port:
   `npm run dev -- --port 5174`

## AI Tutor Setup

The AI tutor provides intelligent, context-aware educational assistance using Groq's free AI. It's designed to help students learn effectively.

**Features:**

- Context-aware responses based on course and lesson content
- Real AI-generated answers using Groq's Mixtral model
- Educational, encouraging, and helpful tone
- Completely free - no API costs or quotas

**Free AI Integration:**

The AI tutor uses Groq's free API key for intelligent responses. Groq provides unlimited free access to their Mixtral 8x7B model.

1. Visit [https://console.groq.com/](https://console.groq.com/)
2. Sign up and get your free API key
3. Add it to your `.env` file as `VITE_GROQ_API_KEY=your_key_here`
4. Restart the app

**Current:** Intelligent mock responses (fully functional)
**Optional:** OpenAI GPT-3.5-turbo (requires API key with available credits)

## Environment Variables

Frontend (`seedit/.env.example`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_public_razorpay_key
VITE_GROQ_API_KEY=your_groq_api_key
```

Backend (`seedit/server/.env.example`)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/seedit
JWT_SECRET=replace_with_a_strong_secret
CLIENT_URL=http://localhost:5173
CLIENT_URLS=http://localhost:5173,https://asiina-7.github.io
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_app_password
EMAIL_FROM=your_email@example.com
GROQ_API_KEY=your_groq_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## Deploy Frontend + Backend

For the GitHub Pages frontend to log in successfully, the backend must be deployed separately and the frontend must point to that deployed API URL.

### Frontend (GitHub Pages)

1. Set `VITE_API_URL` to your deployed backend URL, for example:

   ```env
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

2. Build and deploy the frontend:

   ```bash
   npm install
   npm run deploy
   ```

### Backend (Render or Railway)

The backend lives in `seedit/server` and is ready to run with:

```bash
npm install
npm start
```

Set these environment variables in Render or Railway:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_strong_secret
CLIENT_URL=https://asiina-7.github.io/SEEDDIT_E_LEARNING_PLATFORM
CLIENT_URLS=https://asiina-7.github.io/SEEDDIT_E_LEARNING_PLATFORM,http://localhost:5173
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_app_password
EMAIL_FROM=your_email@example.com
GROQ_API_KEY=your_groq_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Recommended service settings:

1. Root directory: `seedit/server`
2. Start command: `npm start`
3. Node version: `18+`
4. Database: MongoDB Atlas

After deployment:

1. Copy the backend URL from Render or Railway
2. Set `VITE_API_URL` in the frontend
3. Redeploy the frontend to GitHub Pages
4. Confirm the backend health endpoint works at `/api/health`
