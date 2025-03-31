import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "$env/dynamic/public";

const ai = new GoogleGenerativeAI(env.PUBLIC_GOOGLE_API_KEY);
export const model = ai.getGenerativeModel({ model: "gemini-2.5-pro-exp-03-25" });
