export type AutoApplyInput = {
  jobUrl: string;
  resumePath: string;
  coverLetterPath?: string;
  profile: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedInUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
  };
  confirmBeforeSubmit: boolean;
};

export type AutoApplyResult = {
  status: "applied" | "confirmation_required" | "failed";
  confirmationUrl?: string;
  error?: string;
};

export interface AutoApplyAdapter {
  id: string;
  canHandle(url: string): boolean;
  apply(input: AutoApplyInput): Promise<AutoApplyResult>;
}
