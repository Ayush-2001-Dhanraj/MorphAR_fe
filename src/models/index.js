import { GoogleGenAI } from "@google/genai";
import get_gen_text from "./text_model";

export const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export default {
  text: get_gen_text,
};
