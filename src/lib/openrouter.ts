const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const FREE_MODEL =
  process.env.OPENROUTER_MODEL || "qwen/qwen3-coder:free";

const DEMO_MODE = !OPENROUTER_API_KEY;

const DEMO_REPLIES: Record<string, string> = {
  billing:
    "Thank you for reaching out about your billing concern. I've reviewed your account and here's what I found:\n\n1. Your current billing cycle runs from the 1st to the end of each month\n2. All recent charges appear to be in order\n3. If you believe there's a discrepancy, please provide your invoice number and I'll investigate further\n\nIs there anything else I can help you with?",
  technical:
    "Thank you for reporting this issue. I understand how frustrating technical problems can be. Here's what I recommend:\n\n1. First, try clearing your browser cache and cookies\n2. If the issue persists, try using an incognito/private window\n3. Make sure your browser is updated to the latest version\n\nIf none of these steps resolve the issue, I'll escalate this to our engineering team with a detailed report. Could you share any error messages or screenshots?",
  sales:
    "Thank you for your interest in our product! I'd love to help you find the right plan.\n\nHere's a quick overview:\n- **Starter**: $29/mo — Perfect for small teams (up to 5 users)\n- **Professional**: $79/mo — Great for growing businesses (up to 25 users)\n- **Enterprise**: Custom pricing — For large organizations with advanced needs\n\nWould you like to schedule a demo call to see the product in action? I can set one up at your convenience.",
  general:
    "Thank you for contacting us! I'm happy to help.\n\nI've reviewed your message and want to make sure I understand your request correctly. Could you provide a bit more detail about what you're looking for? This will help me direct you to the right resources or team member.\n\nIn the meantime, you might find our FAQ section helpful: it covers many common questions and can provide immediate answers.",
  spam: "",
};

export async function generateReply(
  category: string,
  subject: string,
  body: string
): Promise<string> {
  if (category === "spam") return "";

  if (DEMO_MODE) {
    await new Promise((r) => setTimeout(r, 500));
    return DEMO_REPLIES[category] || DEMO_REPLIES.general;
  }

  const systemPrompt = `You are a professional customer support agent. Generate a helpful, friendly reply to this ${category} support ticket. Keep it concise but thorough. Use markdown for formatting.`;

  const res = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: FREE_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Subject: ${subject}\n\n${body}`,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    return DEMO_REPLIES[category] || DEMO_REPLIES.general;
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || DEMO_REPLIES[category] || "";
}
