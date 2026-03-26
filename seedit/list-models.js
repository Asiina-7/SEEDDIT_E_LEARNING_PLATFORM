
import * as genai from "@google/genai";

const apiKey = "AIzaSyC4zm7jj7nsq6kbf6QYhc5CtSAOsEoZ6d8";
const client = new genai.GoogleGenAI({ apiKey });

async function list() {
    try {
        console.log("Listing models...");
        const response = await client.models.list();
        console.log("Response type:", typeof response);
        console.log("Response keys:", Object.keys(response));
        console.log("Response:", JSON.stringify(response, null, 2));
    } catch (e) {
        console.error("FAILED to list models:", e.message);
    }
}

list();
