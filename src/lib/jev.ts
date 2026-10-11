import type { Classification } from "./types";

const JEV_API_URL =
  process.env.JEV_API_URL || "https://api.typesafe.ai/v1/evaluate";
const JEV_API_KEY = process.env.JEV_API_KEY || "";

const DEMO_MODE = !JEV_API_KEY;

async function jevRequest(body: Record<string, unknown>) {
  if (DEMO_MODE) return null;

  const res = await fetch(JEV_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JEV_API_KEY}`,
    },
    body: JSON.stringify({ model: "jev", ...body }),
  });

  if (!res.ok) return null;
  return res.json();
}

function simulateClassification(
  subject: string,
  body: string
): Classification {
  const text = `${subject} ${body}`.toLowerCase();

  let category: Classification["category"] = "general";
  if (
    text.includes("invoice") ||
    text.includes("payment") ||
    text.includes("billing") ||
    text.includes("charge") ||
    text.includes("refund") ||
    text.includes("price")
  )
    category = "billing";
  else if (
    text.includes("bug") ||
    text.includes("error") ||
    text.includes("crash") ||
    text.includes("broken") ||
    text.includes("not working") ||
    text.includes("fix")
  )
    category = "technical";
  else if (
    text.includes("buy") ||
    text.includes("plan") ||
    text.includes("upgrade") ||
    text.includes("demo") ||
    text.includes("pricing") ||
    text.includes("trial")
  )
    category = "sales";
  else if (
    text.includes("win") ||
    text.includes("click here") ||
    text.includes("congratulations") ||
    text.includes("free money")
  )
    category = "spam";

  let sentiment: Classification["sentiment"] = "neutral";
  const angryWords = [
    "angry",
    "furious",
    "terrible",
    "worst",
    "hate",
    "awful",
    "unacceptable",
    "ridiculous",
  ];
  const negativeWords = [
    "bad",
    "disappointed",
    "unhappy",
    "frustrated",
    "annoyed",
    "issue",
    "problem",
  ];
  const positiveWords = [
    "great",
    "thanks",
    "love",
    "excellent",
    "amazing",
    "happy",
    "wonderful",
  ];

  if (angryWords.some((w) => text.includes(w))) sentiment = "angry";
  else if (negativeWords.some((w) => text.includes(w))) sentiment = "negative";
  else if (positiveWords.some((w) => text.includes(w))) sentiment = "positive";

  const urgency =
    sentiment === "angry"
      ? 0.85 + Math.random() * 0.15
      : sentiment === "negative"
        ? 0.5 + Math.random() * 0.3
        : 0.1 + Math.random() * 0.4;

  const isSpam = category === "spam";
  const shouldEscalate = urgency > 0.8 || sentiment === "angry";

  const inputTokens = Math.ceil((subject.length + body.length) / 4);
  const jevCost = inputTokens * 0.000000042;
  const llmCost = inputTokens * 0.000003;
  const tokensSaved = shouldEscalate || isSpam ? inputTokens * 3 : 0;

  return {
    category,
    urgency: Math.round(urgency * 100) / 100,
    sentiment,
    isSpam,
    confidence: 0.75 + Math.random() * 0.2,
    shouldEscalate,
    processedAt: new Date().toISOString(),
    tokensSaved,
    jevCost: Math.round(jevCost * 1000000) / 1000000,
  };
}

export async function classifyTicket(
  subject: string,
  body: string
): Promise<Classification> {
  const context = `Subject: ${subject}\nBody: ${body}`;

  const jevResult = await jevRequest({
    questions: [
      {
        type: "choice",
        question:
          "What is the category of this support ticket?",
        options: ["billing", "technical", "sales", "general", "spam"],
        context,
      },
      {
        type: "score",
        question:
          "How urgent is this support ticket? Rate from 0 (not urgent) to 1 (extremely urgent).",
        min: 0,
        max: 1,
        context,
      },
      {
        type: "choice",
        question: "What is the sentiment of this support ticket?",
        options: ["positive", "neutral", "negative", "angry"],
        context,
      },
      {
        type: "boolean",
        question: "Is this support ticket spam?",
        context,
      },
    ],
  });

  if (!jevResult) {
    return simulateClassification(subject, body);
  }

  const [categoryResult, urgencyResult, sentimentResult, spamResult] =
    jevResult.answers;

  const urgency = urgencyResult.score;
  const sentiment = sentimentResult.choice;
  const shouldEscalate = urgency > 0.8 || sentiment === "angry";

  const inputTokens = Math.ceil((subject.length + body.length) / 4);

  return {
    category: categoryResult.choice,
    urgency,
    sentiment,
    isSpam: spamResult.probability > 0.5,
    confidence: categoryResult.confidence,
    shouldEscalate,
    processedAt: new Date().toISOString(),
    tokensSaved: shouldEscalate || spamResult.probability > 0.5 ? inputTokens * 3 : 0,
    jevCost: inputTokens * 0.000000042,
  };
}
