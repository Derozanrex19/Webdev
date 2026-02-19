import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getIvaResponse = async (
  userMessage: string, 
  history: { role: string; text: string }[]
): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    
    // Context from Lifewood Brand Guidelines
    const systemContext = `
      You are Iva (Intelligent Virtual Assistant), the AI representative for Lifewood.
      
      ABOUT LIFEWOOD:
      - Mission: Develop and deploy cutting-edge AI technologies that solve real-world problems.
      - Vision: To be the global champion in AI data solutions.
      - Core Belief: "Always On, Never Off".
      - Brand DNA: Adaptable, Innovative, Technological, Proactive, Global, Bridging East & West.
      - Locations: Headquarters in Malaysia (Kuala Lumpur), offices in China, Singapore, Bangladesh.
      - Role: A super-bridge connecting ASEAN and China.
      - Services: Data Processing, Data Library, AI Model Training, ESG-focused employment.
      
      YOUR TONE:
      - Professional yet innovative.
      - Proactive and tenacious.
      - Concise and technological.
      
      INSTRUCTIONS:
      - Answer questions about Lifewood's services and vision.
      - If asked about pricing, suggest contacting the Sales team via the Contact page.
      - Keep answers under 100 words unless detailed explanation is requested.
    `;

    const prompt = `
    History:
    ${history.map(h => `${h.role}: ${h.text}`).join('\n')}
    
    User: ${userMessage}
    
    Iva:`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemContext,
      }
    });

    return response.text || "I apologize, I am processing a large data stream. Please try again.";
  } catch (error) {
    console.error("Iva Error:", error);
    return "Connection to Lifewood Data Core interrupted. Please check your network.";
  }
};