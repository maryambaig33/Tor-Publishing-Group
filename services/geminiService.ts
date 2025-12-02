import { GoogleGenAI, Modality } from "@google/genai";
import { CHARACTERS } from "../constants";
import { Character } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Audio Helper Functions
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// 1. Text Chat with Character Persona
export const generateCharacterResponse = async (
  character: Character,
  userMessage: string
): Promise<string> => {
  try {
    const charData = CHARACTERS[character];
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
      config: {
        systemInstruction: charData.systemPrompt,
        temperature: 0.9,
      },
    });
    return response.text || "The character stares at you blankly.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "The magical connection seems to be interrupted.";
  }
};

// 2. Text-to-Speech (TTS)
export const generateSpeech = async (
  text: string,
  voiceName: string = "Kore"
): Promise<AudioBuffer | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return null;

    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate: 24000,
    });
    
    return await decodeAudioData(
      decode(base64Audio),
      outputAudioContext,
      24000,
      1
    );

  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};

// 3. Image Generation (Fan Art)
export const generateFanArt = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `A whimsical, storybook style fantasy illustration of: ${prompt}. Colorful, magical, detailed, in the style of the book cover art for Brigands & Breadknives.`,
          },
        ],
      },
      config: {
        // Nano banana models don't support responseMimeType or specific schema, 
        // we parse the response for inlineData.
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};