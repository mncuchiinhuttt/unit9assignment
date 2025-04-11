import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyCmUXYOFIYqdBE6CJ7ZKPY9fLtvbJWGVbc" });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "Say hello to the world",
  });
  console.log(response.text);
}

main().catch((error) => {
  console.error("Error:", error);
});