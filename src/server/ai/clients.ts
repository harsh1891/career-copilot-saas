import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

let openai: OpenAI | null = null;
let gemini: GoogleGenerativeAI | null = null;

export function getOpenAI() {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is missing");
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  return openai;
}

export function getGeminiModel() {
  if (!gemini) {
    if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is missing");
    gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  return gemini.getGenerativeModel({ model: "gemini-1.5-pro" });
}
