import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedTitle, StyleAttributes, ImageData } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
};

export const generateTitles = async (topic: string): Promise<GeneratedTitle[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: `Generate 20 engaging, click-worthy YouTube titles for a video about "${topic}". The titles should:
- Use proven engagement patterns (curiosity gaps, numbers, power words, emotional triggers).
- Maintain authenticity and accurately represent the content.
- Vary in style (listicles, questions, bold statements, how-tos).
- Stay within the optimal 60-70 character count.
- Be creative and unique.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            titles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                    title: {
                        type: Type.STRING,
                        description: "An engaging YouTube title"
                    }
                }
              }
            }
          }
        },
      }
    });
    
    const jsonResponse = JSON.parse(response.text);
    return jsonResponse.titles || [];
  } catch (error) {
    console.error("Error generating titles:", error);
    throw new Error("Failed to generate titles. Please try again.");
  }
};

export const generateKeywords = async (topic: string, title: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: `You are a YouTube SEO expert. For a video about "${topic}" titled "${title}", generate 15-20 highly relevant and targeted keywords. Include a mix of short-tail (1-2 words) and long-tail (3+ words) keywords that viewers would use to find this video. Focus on search volume and relevance.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            keywords: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: "A relevant YouTube keyword"
              }
            }
          }
        },
      }
    });
    
    const jsonResponse = JSON.parse(response.text);
    return jsonResponse.keywords || [];
  } catch (error) {
    console.error("Error generating keywords:", error);
    throw new Error("Failed to generate keywords. Please try again.");
  }
};

export const generateDescription = async (topic: string, title: string, keywords: string[]): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: `You are a YouTube SEO expert. Write a compelling and SEO-optimized YouTube video description for a video titled "${title}" about "${topic}".

The description must:
- Be at least 200 words long.
- Start with a strong, engaging hook to capture viewer interest immediately.
- Clearly explain what the video is about and what viewers will learn.
- Naturally incorporate the following keywords throughout the text: ${keywords.join(', ')}.
- Include 3-5 relevant hashtags at the end (e.g., #React #WebDevelopment).
- Have a clear structure with paragraphs for readability.
- Optionally include a call-to-action (e.g., "Subscribe for more content!").
- IMPORTANT: Do not include any introductory phrases or conversational filler. The output should be only the description itself, starting directly with the hook.`,
    });
    
    let descriptionText = response.text.trim();
    // Clean up a specific, unwanted introductory phrase if the model still includes it.
    descriptionText = descriptionText.replace(/^بالتأكيد! إليك وصف فيديو يوتيوب احترافي ومُحسّن لمحركات البحث \(SEO\) حول مدينة كلميم، مصمم لجذب المشاهدين وتحقيق ترتيب عالٍ في نتائج البحث\./, '').trim();
    return descriptionText;
  } catch (error) {
    console.error("Error generating description:", error);
    throw new Error("Failed to generate description. Please try again.");
  }
};

export const generateThumbnail = async (
  title: string,
  topic: string,
  faceImage: ImageData | null,
  stylePrompt: string
): Promise<string> => {
  try {
    const textPrompt = `Create a professional, high-contrast 1280x720 YouTube thumbnail for a video titled "${title}".
The video is about: "${topic}".
${faceImage ? "Incorporate the person's face from the provided image naturally as the main subject. The expression on the face should be engaging and relevant to the title." : ""}
The title text "${title}" should be a bold, readable overlay on the thumbnail.
Use attention-grabbing colors and a dynamic composition that stands out in YouTube search results.
${stylePrompt}
Ensure the final image is exactly 1280x720 pixels and has extremely high detail and quality, aiming for a final file size larger than 2MB.`;

    const contents = faceImage
      ? { parts: [{ text: textPrompt }, fileToGenerativePart(faceImage.base64, 'image/jpeg')] }
      : { parts: [{ text: textPrompt }] };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents,
      config: {
        responseModalities: ['IMAGE'],
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData) {
      return part.inlineData.data;
    }
    throw new Error("No image data returned from API.");
  } catch (error) {
    console.error("Error generating thumbnail:", error);
    throw new Error("Failed to generate thumbnail. Please try again.");
  }
};


export const editThumbnail = async (
  currentThumbnailBase64: string,
  editCommand: string,
  title: string,
  faceImage: ImageData | null
): Promise<string> => {
    try {
        const textPrompt = `Take the existing YouTube thumbnail provided and apply the following edit: "${editCommand}".
The original title for context is "${title}".
${faceImage ? "The original subject's face is also provided for reference, ensure the person's likeness is preserved." : ""}
The output must be a new, high-quality 1280x720 YouTube thumbnail incorporating the change. It should have extremely high detail and quality, aiming for a final file size larger than 2MB.`;

        const parts = [
            { text: textPrompt },
            fileToGenerativePart(currentThumbnailBase64, 'image/png'),
        ];

        if (faceImage) {
            parts.push(fileToGenerativePart(faceImage.base64, 'image/jpeg'));
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts },
            config: {
                responseModalities: ['IMAGE'],
            },
        });

        const part = response.candidates?.[0]?.content?.parts?.[0];
        if (part && part.inlineData) {
            return part.inlineData.data;
        }
        throw new Error("No image data returned from API for editing.");
    } catch (error) {
        console.error("Error editing thumbnail:", error);
        throw new Error("Failed to edit thumbnail. Please try again.");
    }
};

export const analyzeStyle = async (styleImages: ImageData[]): Promise<StyleAttributes> => {
    try {
        const textPrompt = `Analyze the style of the provided YouTube thumbnails. Extract the key style elements:
1.  **Color Palette:** Identify the dominant and accent colors. Provide hex codes.
2.  **Typography:** Describe the font style (e.g., bold sans-serif, handwritten), size, and positioning.
3.  **Layout Composition:** Describe the layout (e.g., rule of thirds, centered subject).
4.  **Visual Effects:** Note any prominent effects like shadows, glows, borders, or background patterns.

Respond with only a JSON object following the specified schema.`;

        const parts: any[] = [{ text: textPrompt }];
        styleImages.forEach(img => {
            parts.push(fileToGenerativePart(img.base64, 'image/jpeg'));
        });

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: { parts },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        palette: { type: Type.ARRAY, items: { type: Type.STRING } },
                        typography: { type: Type.STRING },
                        layout: { type: Type.STRING },
                        effects: { type: Type.STRING }
                    },
                    required: ["palette", "typography", "layout", "effects"]
                },
            }
        });
        
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error analyzing style:", error);
        throw new Error("Failed to analyze thumbnail styles. Please try again.");
    }
};