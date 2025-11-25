import { GoogleGenAI } from "@google/genai";
import { AspectRatio, ImageResolution, ModelType } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize specific instances for different needs if necessary, 
// though one instance is usually enough.
const createAIClient = () => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please select an API Key.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateVSCover = async (
  prompt: string,
  imageA: string | null, // base64
  imageB: string | null, // base64
  aspectRatio: AspectRatio,
  resolution: ImageResolution
): Promise<string> => {
  const ai = createAIClient();
  
  const parts: any[] = [];

  // Add images if they exist
  if (imageA) {
    parts.push({
      inlineData: {
        data: imageA,
        mimeType: 'image/png', // Assuming PNG for now, can be detected from base64 header
      },
    });
  }

  if (imageB) {
    parts.push({
      inlineData: {
        data: imageB,
        mimeType: 'image/png',
      },
    });
  }

  // Add the text prompt
  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: ModelType.PRO_IMAGE, // Using Pro for high quality generation
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: resolution,
        },
      },
    });

    // Handle response parts
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }
    
    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

export const editImageWithFlash = async (
  base64Image: string,
  prompt: string
): Promise<string> => {
    const ai = createAIClient();

    try {
        const response = await ai.models.generateContent({
            model: ModelType.FLASH_IMAGE,
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Image,
                            mimeType: 'image/png',
                        }
                    },
                    { text: prompt }
                ]
            }
        });

        if (response.candidates && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
              if (part.inlineData) {
                const base64EncodeString = part.inlineData.data;
                return `data:image/png;base64,${base64EncodeString}`;
              }
            }
          }
          
          throw new Error("No image data found in response");
    } catch (error) {
        console.error("Error editing image:", error);
        throw error;
    }
};

export const checkApiKey = async () => {
   if (window.aistudio && window.aistudio.hasSelectedApiKey) {
       return await window.aistudio.hasSelectedApiKey();
   }
   return true; // Fallback for dev environments without the wrapper
}

export const openApiKeySelection = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
        await window.aistudio.openSelectKey();
    }
}