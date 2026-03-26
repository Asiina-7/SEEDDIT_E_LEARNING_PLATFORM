
import * as genai from "@google/genai";

console.log("Exports from @google/genai:");
console.log(Object.keys(genai));

const apiKey = "AIzaSyAJWM4Cr8J4jmw3R6S6e78nHE9wA3T-4Ok";
console.log("\nTesting initialization with GoogleGenAI...");
try {
    const client = new genai.GoogleGenAI({ apiKey });
    console.log("Client created with new GoogleGenAI({ apiKey })");
    console.log("Client properties:", Object.keys(client));
} catch (e) {
    console.log("Failed with new GoogleGenAI({ apiKey }):", e.message);
}

try {
    const client = new genai.GoogleGenAI(apiKey);
    console.log("\nClient created with new GoogleGenAI(apiKey)");
} catch (e) {
    console.log("Failed with new GoogleGenAI(apiKey):", e.message);
}
