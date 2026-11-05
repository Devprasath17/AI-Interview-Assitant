import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded whether running from server, root, or parent directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const CANDIDATE_MODELS = ['gemini-2.5-flash', 'gemini-3.5-flash-lite', 'gemini-flash-latest'];

const cleanJson = (text) => {
  if (!text) return '{}';
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/i, '').replace(/```\s*$/, '');
  }
  return cleaned.trim();
};

const getApiKey = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please verify your server/.env file.');
  }
  return apiKey;
};

/**
 * Executes a Gemini prompt across available models with automatic fallback
 */
const generateWithGemini = async (prompt, systemInstruction = '') => {
  const apiKey = getApiKey();
  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json',
        },
        systemInstruction: systemInstruction || undefined,
      });

      const result = await model.generateContent(prompt);
      const text = result?.response?.text();
      if (text) {
        return { text, model: modelName };
      }
    } catch (err) {
      console.warn(`[GeminiService] Model ${modelName} error: ${err.message}. Trying next candidate...`);
      lastError = err;
    }
  }

  throw new Error(`Gemini API call failed: ${lastError?.message || 'Unable to generate response from Gemini API.'}`);
};

/**
 * Dynamically generates interview questions tailored to role and experience level
 */
export const generateQuestionsFromGemini = async ({
  role,
  experience,
  topics = [],
  difficulty = 'Intermediate',
  description = '',
  count = 5,
}) => {
  const topicsList = Array.isArray(topics) ? topics : (topics ? [topics] : []);
  const topicsStr = topicsList.join(', ');
  const primaryTopic = topicsList[0] || role;

  const prompt = `You are an elite Technical Recruiter and Senior Hiring Bar Raiser at top tech companies.
Generate exactly ${count} realistic, high-impact technical and behavioral interview questions for a candidate with the following profile:

- Target Role: ${role}
- Experience Level: ${experience}
- Core Topics: ${topicsStr || 'Core competencies and best practices for this role'}
- Target Difficulty: ${difficulty}
- Specific Focus/Description: ${description || 'Comprehensive interview evaluation'}

For each question, provide:
1. An interview-ready, structured model answer demonstrating competency.
2. The technical category/topic.
3. The difficulty level.
4. Evaluation focus: key concepts, trade-offs, and architecture/mechanics the interviewer evaluates.

Return a JSON array of objects with the exact structure:
[
  {
    "question": "Full question text clearly phrased as asked in real interviews",
    "answer": "Comprehensive, structured model answer that demonstrates strong competency",
    "category": "${primaryTopic}",
    "difficulty": "${difficulty}",
    "evaluationFocus": "Key architectural principles, lifecycle mechanics, or problem-solving trade-offs evaluated"
  }
]`;

  const { text } = await generateWithGemini(prompt);
  const cleaned = cleanJson(text);
  let parsed;

  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.error('[GeminiService] Failed to parse JSON response from Gemini:', cleaned);
    throw new Error('Gemini API returned an invalid response format.');
  }

  let questions = [];
  if (Array.isArray(parsed)) {
    questions = parsed;
  } else if (parsed && Array.isArray(parsed.questions)) {
    questions = parsed.questions;
  } else if (parsed && typeof parsed === 'object') {
    const arrayKey = Object.keys(parsed).find((k) => Array.isArray(parsed[k]));
    if (arrayKey) {
      questions = parsed[arrayKey];
    }
  }

  if (!questions || questions.length === 0) {
    throw new Error('Gemini API did not return any interview questions.');
  }

  return questions.map((q, idx) => ({
    question: q.question || `Interview Question ${idx + 1}`,
    answer: q.answer || 'Standard industry model answer.',
    category: q.category || primaryTopic,
    difficulty: q.difficulty || difficulty,
    evaluationFocus: q.evaluationFocus || `Evaluates core competency in ${primaryTopic} and structured problem solving.`,
  }));
};

/**
 * Generates an educational breakdown for a specific question
 */
export const generateLearningBreakdown = async ({
  question,
  answer,
  category = 'General',
  difficulty = 'Intermediate',
  role = 'Software Engineer',
}) => {
  const prompt = `You are a master AI Interview Coach assisting a candidate practicing for a ${role} position.
Break down the following interview question into an empowering, deeply educational learning guide.

Question: "${question}"
Model Answer: "${answer}"
Category: "${category}"
Difficulty: "${difficulty}"

Generate a comprehensive learning breakdown in JSON with the exact fields:
{
  "simpleExplanation": "Clear, accessible, jargon-free breakdown explaining what this concept means and why interviewers test it.",
  "realWorldExample": "A practical, vivid industry case study or scenario demonstrating how top engineering teams solve this in production.",
  "interviewTip": "An insider tip or phrasing strategy to help the candidate stand out from 95% of other applicants.",
  "commonMistake": "The #1 pitfall or red flag candidates make when answering this question and how to avoid it.",
  "keyTakeaways": [
    "Core concept summary bullet 1",
    "Key architectural or algorithmic rule bullet 2",
    "Interview execution takeaway bullet 3",
    "Mental model or framework bullet 4"
  ]
}`;

  try {
    const { text } = await generateWithGemini(prompt);
    return JSON.parse(cleanJson(text));
  } catch (error) {
    console.error('[GeminiService] Error generating learning breakdown:', error.message);
    throw error;
  }
};

/**
 * Evaluates a candidate's answer against the model benchmark
 */
export const evaluateUserAnswer = async ({
  question,
  expectedAnswer,
  userAnswer,
  role = 'Software Engineer',
}) => {
  const prompt = `You are a senior hiring bar raiser evaluating an interview candidate's response.

Question: "${question}"
Expected Benchmark Answer: "${expectedAnswer}"
Candidate's Response: "${userAnswer}"
Target Role: "${role}"

Evaluate the candidate's answer and output a structured JSON:
{
  "score": 85,
  "strengths": [
    "Specific positive point about their answer",
    "Strong technical concept mentioned"
  ],
  "improvements": [
    "Missing depth on a specific area",
    "Suggestion for clearer phrasing"
  ],
  "scoreExplanation": "Summary paragraph explaining why this score was awarded and what elevates it to a 100/100."
}`;

  try {
    const { text } = await generateWithGemini(prompt);
    return JSON.parse(cleanJson(text));
  } catch (error) {
    console.error('[GeminiService] Error evaluating user answer:', error.message);
    throw error;
  }
};
