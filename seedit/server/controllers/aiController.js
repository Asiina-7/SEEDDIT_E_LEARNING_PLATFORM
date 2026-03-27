const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * @desc    Handle chat request using Groq's Mixtral model
 * @route   POST /api/ai/chat
 * @access  Public
 */
const handleChat = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are an intelligent e-learning tutor for the Seedit platform. Provide clear, encouraging, and accurate educational support.'
                },
                ... (history || []).map(entry => ({
                    role: entry.role === 'user' ? 'user' : 'assistant',
                    content: entry.text
                })),
                {
                    role: 'user',
                    content: message
                }
            ],
            model: 'mixtral-8x7b-32768',
            temperature: 0.7,
            max_tokens: 1024,
        });

        const aiResponse = chatCompletion.choices[0]?.message?.content || 'I am sorry, I could not generate a response.';
        res.json({ response: aiResponse });
    } catch (error) {
        console.error('Groq AI Error:', error);
        res.status(500).json({ error: 'Failed to generate AI response' });
    }
};

module.exports = { handleChat };
