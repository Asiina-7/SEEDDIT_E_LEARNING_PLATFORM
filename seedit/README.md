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
