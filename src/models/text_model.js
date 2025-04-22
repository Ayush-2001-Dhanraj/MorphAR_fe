import { ai } from "./index";
import { Modality } from "@google/genai";

function isImagePrompt(history, prompt) {
  const promptLower = prompt.toLowerCase();

  const imageActionKeywords =
    /create|generate|visualize|draw|illustrate|edit|modify|enhance|change|add|remove|make/i;
  const refersToImage =
    /image|picture|photo|drawing|her|him|face|look|eyes|smile/i.test(
      promptLower
    );

  const containsImageKeyword = imageActionKeywords.test(promptLower);

  // Check if the last model response included an image
  const lastModelResponse = [...history]
    .reverse()
    .find((msg) => msg.role === "model");
  const lastWasImage = lastModelResponse?.parts?.some((part) =>
    part?.inlineData?.mimeType?.startsWith("image/")
  );

  return containsImageKeyword || lastWasImage || refersToImage;
}

async function get_gen_text(history, prompt) {
  const isImage = isImagePrompt(history, prompt);

  console.log("isImage", isImage);

  const chat = ai.chats.create({
    model: isImage
      ? "gemini-2.0-flash-exp-image-generation"
      : "gemini-2.0-flash",
    history,
  });

  await chat.sendMessage({
    message: prompt,
    config: {
      responseModalities: isImage
        ? [Modality.TEXT, Modality.IMAGE]
        : [Modality.TEXT],
    },
  });
}

export default get_gen_text;
