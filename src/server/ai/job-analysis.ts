import { getGeminiModel } from "@/server/ai/clients";

export async function analyzeJobDescription(jobDescription: string) {
  if (!process.env.GEMINI_API_KEY) {
    return {
      senioritySignals: [],
      coreResponsibilities: [],
      keywords: []
    };
  }

  const model = getGeminiModel();
  const result = await model.generateContent(`
Analyze this SWE job description. Return compact JSON with senioritySignals, coreResponsibilities, keywords, atsWarnings.

${jobDescription.slice(0, 12000)}
`);

  const text = result.response.text();
  const json = text.match(/\{[\s\S]*\}/)?.[0];
  if (!json) return { senioritySignals: [], coreResponsibilities: [], keywords: [] };
  return JSON.parse(json) as {
    senioritySignals: string[];
    coreResponsibilities: string[];
    keywords: string[];
    atsWarnings?: string[];
  };
}
