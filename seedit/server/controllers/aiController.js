const { GoogleGenAI } = require('@google/genai');

// POST /api/ai/chat
const handleChat = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const model = 'gemini-2.5-flash';

        // simple one off call for testing proxy
        const response = await ai.models.generateContent({
            model: model,
            contents: message,
        });

        res.json({ response: response.text });
    } catch (error) {
        console.error('AI Proxy Error:', error);
        res.status(500).json({ error: 'Failed to generate AI response' });
    }
};

module.exports = { handleChat };
