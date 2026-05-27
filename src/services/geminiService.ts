import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

const GENAI_MODEL = "gemini-3-flash-preview";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async getChatResponse(messages: ChatMessage[], cityContext?: string): Promise<string> {
    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
    
    const lastMessage = messages[messages.length - 1].content;
    const now = new Date();

    try {
      const chat = this.ai.chats.create({
        model: GENAI_MODEL,
        config: {
          systemInstruction: `You are SkyPak Assistant, an astronomy guide specialized for Pakistani stargazers. 
          Current context: ${cityContext || 'Pakistan'}, Date: ${now.toDateString()}, Time: ${now.toLocaleTimeString('en-PK', { timeZone: 'Asia/Karachi' })} PKT.
          Respond in the language the user speaks (English or Urdu).
          Always give times in PKT (UTC+5). 
          Reference Pakistani cities like Karachi, Lahore, Islamabad, etc.
          Be friendly, brief, and educational. Keep responses under 3 paragraphs.`,
        },
        history: history as any,
      });

      const result = await chat.sendMessage({
        message: lastMessage,
      });

      return result.text || "I'm sorry, I couldn't process that.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "The connection to space is fuzzy. Please try again later.";
    }
  }

  async getEventDescription(eventName: string, cityName: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: GENAI_MODEL,
        contents: `Provide a 2-sentence description for the astronomical event "${eventName}" visible from ${cityName}, Pakistan. Include a stargazing tip.`,
      });
      return response.text || "";
    } catch (error) {
      return "A notable event in the heavens. Don't miss it!";
    }
  }
}

export const gemini = new GeminiService();
