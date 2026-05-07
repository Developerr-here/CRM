import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const testAI = async () => {
  console.log("🔍 Checking API Key...");
  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ ERROR: GEMINI_API_KEY is missing in .env");
    return;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  try {
    console.log("Key Length:", process.env.GEMINI_API_KEY.length);
    console.log("📡 Sending test request to Gemini...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = "Say 'Connection Successful' and give me a random number.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    console.log("✅ RESPONSE FROM AI:", response.text());
  } catch (error) {
    console.error("❌ CONNECTION FAILED!");
    console.error("Error Message:", error.message);
    console.log("\nPossible Fixes:");
    console.log("1. Check if your API key is valid.");
    console.log("2. Ensure you have internet access.");
    console.log("3. Check if your .env file is in the root backend folder.");
  }
};

testAI();