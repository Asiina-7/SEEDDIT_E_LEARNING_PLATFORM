
import { GoogleGenAI } from "@google/genai";

const apiKey = "AIzaSyAJWM4Cr8J4jmw3R6S6e78nHE9wA3T-4Ok";
const genAI = new GoogleGenAI({ apiKey });

async function test() {
    try {
        console.log("Testing with gemini-pro...");
const response = await genAI.models.generateContent({
    model: "publishers/google/models/gemini-1.5-pro",
    contents: [{ role: 'user', parts: [{ text: "Hi, who are you?" }] }],
    config: {
        systemInstruction: "You are a helpful tutor.",
    }
});
console.log("SUCCESS! Response text:", response.text);
    } catch (error) {
        console.error("FAILED:", error.message);
    }
}

test();
