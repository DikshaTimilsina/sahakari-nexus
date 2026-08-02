export function getMockReply(question: string): string {
  const lower = question.toLowerCase();

  if (lower.includes("risk")) {
    return "Based on the latest data, the overall risk score is moderate, driven mainly by a declining loan repayment rate over the last two quarters.";
  }

  if (lower.includes("member")) {
    return "Membership has grown steadily, with a 4% increase this quarter and low churn, indicating strong community trust.";
  }

  if (lower.includes("reserve")) {
    return "Reserve funds are growing slower than lending volume, which is reducing the cooperative's safety margin. Increasing reserve contributions is recommended.";
  }

  return "I looked into that, but I don't have a specific answer yet. Try asking about risk score, membership growth, or reserve funds.";
}

export const suggestedQuestions: string[] = [
  "What is the current risk score?",
  "How has membership changed recently?",
  "Are reserve funds healthy?",
];