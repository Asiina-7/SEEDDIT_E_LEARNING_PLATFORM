# Backend Deployment

This project uses a separate backend service in `seedit/server`. GitHub Pages can host only the frontend, so login and API features need this backend deployed on Render or Railway.

## Render

1. Push this repository to GitHub.
2. Open Render and create a new `Blueprint` or `Web Service`.
3. If using Blueprint, point Render to this repository and it will read `render.yaml`.
4. If using a Web Service manually, use:

   - Root directory: `seedit/server`
   - Build command: `npm install`
   - Start command: `npm start`
   - Health check path: `/api/health`

5. Set these environment variables:

```env
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

6. Deploy the service.
7. After deployment, open:

```text
https://your-render-service.onrender.com/api/health
```

If it returns JSON with `"status": "ok"`, the backend is live.

## Railway

1. Create a new project from your GitHub repository.
2. Set the service root directory to `seedit/server`.
3. Railway usually detects Node automatically. If needed, use:

   - Build command: `npm install`
   - Start command: `npm start`

4. Add the same environment variables listed above.
5. Deploy the service.
6. Test:

```text
https://your-railway-domain/api/health
```

## After Backend Deployment

Once you get the backend URL, set the frontend environment variable:

```env
VITE_API_URL=https://your-backend-url/api
```

Then rebuild and redeploy the frontend GitHub Pages site so login, registration, uploads, and API calls go to the live backend.
