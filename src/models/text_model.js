import { ai } from "./index";

async function get_gen_text(history, prompt) {
  const chat = ai.chats.create({
    model: "gemini-2.5-flash-preview-04-17",
    history,
  });

  const response = await chat.sendMessage({
    message: prompt,
  });
}

export default get_gen_text;
