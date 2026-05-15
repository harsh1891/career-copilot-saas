import { getOpenAI } from "@/server/ai/clients";
import { coverLetterSystemPrompt, resumeTailoringSystemPrompt } from "@/server/ai/prompts";

export async function tailorResume(input: { masterResume: string; jobDescription: string; jobTitle: string; company: string }) {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: resumeTailoringSystemPrompt },
      {
        role: "user",
        content: JSON.stringify(input)
      }
    ]
  });

  return JSON.parse(response.choices[0]?.message.content ?? "{}") as {
    markdownResume: string;
    truthReport: Record<string, unknown>;
    missingEvidence: string[];
    riskyClaims: string[];
  };
}

export async function generateCoverLetter(input: { masterResume: string; jobDescription: string; jobTitle: string; company: string }) {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: coverLetterSystemPrompt },
      { role: "user", content: JSON.stringify(input) }
    ]
  });

  return response.choices[0]?.message.content?.trim() ?? "";
}
