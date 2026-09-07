const { GoogleGenAI, Type } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const digestSchema = {
  type: Type.OBJECT,
  properties: {
    decisions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    actionItems: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          task: { type: Type.STRING },
          owner: { type: Type.STRING },
        },
        required: ['task', 'owner'],
      },
    },
    openQuestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: ['decisions', 'actionItems', 'openQuestions'],
};

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function extractDigest(notesText, retries = 3) {
  const prompt = `You are analyzing raw meeting notes. Extract three things:
1. Decisions that were made (clear, finalized choices — not just discussion)
2. Action items, each with a task and an owner (if no owner is mentioned, use "Unassigned")
3. Open questions that were raised but not resolved

Meeting notes:
"""
${notesText}
"""`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: digestSchema,
        },
      });

      const parsed = JSON.parse(response.text);

      const isValidShape =
        Array.isArray(parsed.decisions) &&
        Array.isArray(parsed.actionItems) &&
        Array.isArray(parsed.openQuestions);

      if (!isValidShape) {
        throw new Error('AI returned an unexpected response shape');
      }

      return parsed;
    } catch (err) {
      const isOverloaded = err.message.includes('UNAVAILABLE') || err.message.includes('503');
      const isLastAttempt = attempt === retries;

      if (isOverloaded && !isLastAttempt) {
        console.log(`Gemini overloaded, retrying (attempt ${attempt}/${retries})...`);
        await wait(attempt * 1000); // wait 1s, then 2s, then 3s
        continue;
      }

      throw err;
    }
  }
}

module.exports = { extractDigest };