export interface Ticket {
  id: string;
  subject: string;
  body: string;
  sender: string;
  receivedAt: string;
  classification?: Classification;
  autoReply?: string;
  status: "new" | "classified" | "replied" | "escalated";
}

export interface Classification {
  category: "billing" | "technical" | "sales" | "general" | "spam";
  urgency: number;
  sentiment: "positive" | "neutral" | "negative" | "angry";
  isSpam: boolean;
  confidence: number;
  shouldEscalate: boolean;
  processedAt: string;
  tokensSaved: number;
  jevCost: number;
}

export interface Stats {
  totalTickets: number;
  classified: number;
  autoReplied: number;
  escalated: number;
  spamBlocked: number;
  avgUrgency: number;
  totalTokensSaved: number;
  totalCostSaved: number;
  categoryBreakdown: Record<string, number>;
  sentimentBreakdown: Record<string, number>;
}

export interface JevChoiceRequest {
  question: string;
  options: string[];
  context?: string;
}

export interface JevScoreRequest {
  question: string;
  min: number;
  max: number;
  context?: string;
}

export interface JevBooleanRequest {
  question: string;
  context?: string;
}
