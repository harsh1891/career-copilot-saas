const commonSkillTerms = [
  "typescript",
  "javascript",
  "react",
  "next.js",
  "node.js",
  "python",
  "java",
  "postgresql",
  "aws",
  "docker",
  "kubernetes",
  "graphql",
  "rest",
  "prisma",
  "redis",
  "ci/cd",
  "testing"
];

function tokenize(value: string) {
  return new Set(value.toLowerCase().match(/[a-z0-9.+#/-]+/g) ?? []);
}

export function scoreResumeAgainstJob(resumeText: string, jobDescription: string) {
  const resumeTokens = tokenize(resumeText);
  const jobTokens = tokenize(jobDescription);
  const jobSkills = commonSkillTerms.filter((term) => jobDescription.toLowerCase().includes(term));
  const matchedSkills = jobSkills.filter((term) => resumeText.toLowerCase().includes(term));
  const missingSkills = jobSkills.filter((term) => !matchedSkills.includes(term));
  const keywordMatches = [...jobTokens].filter((token) => resumeTokens.has(token));
  const score = Math.min(100, Math.round((matchedSkills.length / Math.max(jobSkills.length, 1)) * 60 + Math.min(keywordMatches.length, 40)));

  return {
    score,
    matchedSkills,
    missingSkills,
    keywords: keywordMatches.slice(0, 30),
    summary: `${matchedSkills.length}/${jobSkills.length} detected technical skills match this job description.`
  };
}
