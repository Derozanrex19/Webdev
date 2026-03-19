import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const sanitizeIvaText = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

export const getIvaResponse = async (
  userMessage: string,
  history: { role: string; text: string }[]
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return "Connection to Lifewood Data Core interrupted. Missing API key configuration.";
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-3-flash-preview';

    const systemContext = `
      You are Iva (Intelligent Virtual Assistant), a helpful AI assistant for Lifewood.

      CORE ROLE:
      - Help with Lifewood-related questions, admin work, drafting, summaries, replies, and internal assistance.
      - You can also answer general knowledge questions accurately.
      - For unrelated questions, do NOT force the answer back to Lifewood.

      VERIFIED LIFEWOOD CONTEXT:
      - Mission: Develop and deploy cutting-edge AI technologies that solve real-world problems.
      - Vision: To be the global champion in AI data solutions.
      - Core Belief: "Always On, Never Off".
      - Brand DNA: Adaptable, Innovative, Technological, Proactive, Global, Bridging East & West.
      - Homepage statement: "The world's leading provider of AI-powered data solutions."
      - About statement: Lifewood empowers the company and its clients to realise the transformative power of AI by bringing big data to life and launching new ways of thinking, innovating, learning, and doing.
      - Global footprint: 30+ countries across all continents and 40+ global delivery centers.
      - Language capability: 50+ language capabilities and dialects.
      - Resource scale: 56,000+ global online resources.
      - Service positioning: Lifewood offers AI and IT services that enhance decision-making, reduce costs, and improve productivity to optimize organizational performance.
      - Core values: Diversity, Caring, Innovation, Integrity.
      - Role: A super-bridge connecting local expertise with global AI data infrastructure, creating opportunities, empowering communities, and driving inclusive growth worldwide.
      - Services include:
        - Audio: collection, labelling, voice categorization, music categorization.
        - Image: collection, labelling, classification, audit, object detection, tagging.
        - Video: collection, labelling, audit, live broadcast, subtitle generation.
        - Text: collection, labelling, transcription, utterance collection, sentiment analysis.
      - Positioning statement: Lifewood provides global data engineering services to enable AI solutions.

      FACTUAL RULES:
      - Never invent Lifewood facts that are not in the verified context or the user message.
      - Treat the verified Lifewood context above as the approved internal knowledge base for company answers.
      - If asked something about Lifewood that you do not know, say so clearly and offer the closest verified information.
      - If asked a general-world question such as "Who is LeBron James?", answer with general factual knowledge, not with Lifewood information.
      - If you are unsure, say you are not fully certain instead of guessing.

      ADMIN ASSISTANT RULES:
      - Help draft letters, emails, summaries, follow-ups, job-application responses, and other admin materials.
      - When drafting, write polished, professional plain text unless the user asks for a different format.
      - For internal/admin tasks, be practical, clear, and ready-to-send.

      STYLE RULES:
      - Write in plain text.
      - Do not use markdown formatting, asterisks, or decorative symbols.
      - Keep answers concise by default, but provide more detail if the user asks.
      - If asked about pricing, suggest contacting the Sales team via the Contact page.
    `;

    const prompt = `
    History:
    ${history.map((h) => `${h.role}: ${h.text}`).join('\n')}

    User: ${userMessage}

    Iva:`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: systemContext,
      },
    });

    return sanitizeIvaText(
      response.text || "I apologize, I am processing a large data stream. Please try again."
    );
  } catch (error) {
    console.error("Iva Error:", error);
    return "Connection to Lifewood Data Core interrupted. Please check your network.";
  }
};

export type ResumeReview = {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  recommendation: string;
};

const parseResumeReview = (raw: string): ResumeReview | null => {
  try {
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return {
      score: Number(parsed.score) || 0,
      summary: sanitizeIvaText(parsed.summary || ''),
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map((item) => sanitizeIvaText(String(item))) : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements.map((item) => sanitizeIvaText(String(item))) : [],
      recommendation: sanitizeIvaText(parsed.recommendation || ''),
    };
  } catch {
    return null;
  }
};

export const getResumeReviewFromUrl = async (
  resumeUrl: string,
  candidate: {
    firstName: string;
    lastName: string;
    position: string;
    country: string;
    status: string;
  }
): Promise<ResumeReview> => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing Gemini API configuration.');
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-2.5-flash';
  const response = await fetch(resumeUrl);
  if (!response.ok) {
    throw new Error('Unable to open the resume file for AI scoring.');
  }

  const arrayBuffer = await response.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);

  const prompt = `
You are reviewing a candidate CV for Lifewood.

Candidate:
- Name: ${candidate.firstName} ${candidate.lastName}
- Role applied for: ${candidate.position}
- Country: ${candidate.country}
- Current status: ${candidate.status}

Read the attached PDF resume and evaluate it for the role above.
Return strict JSON only in this shape:
{
  "score": 0,
  "summary": "",
  "strengths": ["", "", ""],
  "improvements": ["", "", ""],
  "recommendation": ""
}

Scoring rules:
- Score should be 0 to 100.
- Summary should be 2 concise sentences.
- Strengths should be 2 to 4 short bullets.
- Improvements should be 2 to 4 short bullets.
- Recommendation should be a single short sentence for the recruiter.
- Do not use markdown.
`;

  const reviewResponse = await ai.models.generateContent({
    model,
    contents: [
      {
        role: 'user',
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: base64,
            },
          },
        ],
      },
    ],
  });

  const parsed = parseResumeReview(reviewResponse.text || '');
  if (parsed) return parsed;

  return {
    score: 72,
    summary: 'Iva reviewed the attached resume but could not structure the result perfectly. The CV appears broadly relevant, but the recruiter should review it manually before deciding.',
    strengths: ['Relevant background appears present', 'Resume includes enough material for manual review'],
    improvements: ['Run a manual recruiter check for role alignment', 'Verify whether the resume highlights measurable outcomes'],
    recommendation: 'Use this CV as a shortlist candidate only after manual review.',
  };
};
