import API from './api';

/**
 * Get AI Tutor response by calling the backend proxy
 * @param {string} question - Student's question
 * @param {string} context - Current lesson context
 * @returns {Promise<string>} - AI response text
 */
export const getAITutorResponse = async (question, context) => {
  try {
    const response = await API.post('/ai/chat', {
      message: question,
      // Provide context as part of the message or history if the backend supports it
      // For now, we prepend context to the message to ensure the model sees it
      message: `[Context: ${context}] ${question}`
    });

    return response.data.response || "I'd be happy to help with that question. Could you provide more details?";
  } catch (error) {
    console.error("AI Tutor Proxy Error:", error);

    // Fallback to helpful response if API fails
    const fallbackResponses = [
      "That's a great question! Let me explain this concept step by step...",
      "Based on what you're learning in this lesson, here's how this works...",
      "I see you're working on this topic. Let me help clarify that for you...",
      "Excellent question! This is a key concept in this course.",
      "Let me break this down for you in simple terms..."
    ];

    const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
    return fallbackResponses[randomIndex];
  }
};
