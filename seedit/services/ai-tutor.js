import Groq from 'groq-sdk';

export const getAITutorResponse = async (question, context) => {
  const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true
  });

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a friendly and helpful tutor for the Seedit e-learning platform. Keep responses concise (2-3 sentences), educational, and encouraging. 
          
Course Context: ${context}

Provide clear explanations tailored to help students understand the material better.`
        },
        {
          role: "user",
          content: question
        }
      ],
      model: "mixtral-8x7b-32768",
      max_tokens: 400,
      temperature: 0.7
    });

    return completion.choices[0]?.message?.content || "I'd be happy to help with that question. Could you provide more details?";
  } catch (error) {
    console.error("Groq Error:", error);

    // Fallback to helpful response if API fails
    const fallbackResponses = [
      "That's a great question! Let me explain this concept step by step...",
      "Based on what you're learning in this lesson, here's how this works...",
      "I see you're working on this topic. Let me help clarify that for you...",
      "Excellent question! This is a key concept in this course.",
      "Let me break this down for you in simple terms..."
    ];

    const response = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    return `${response}`;
  }
};
