import { NextRequest, NextResponse } from "next/server";
import { generateReply } from "@/lib/openrouter";
import { getTicket, saveTicket } from "@/lib/store";

export async function POST(req: NextRequest) {
  const { ticketId, category, subject, body } = await req.json();

  if (!category || !subject || !body) {
    return NextResponse.json(
      { error: "category, subject, and body are required" },
      { status: 400 }
    );
  }

  if (category === "spam") {
    return NextResponse.json({ reply: "", skipped: true });
  }

  const reply = await generateReply(category, subject, body);

  if (ticketId) {
    const ticket = getTicket(ticketId);
    if (ticket) {
      ticket.autoReply = reply;
      ticket.status = "replied";
      saveTicket(ticket);
    }
  }

  return NextResponse.json({ reply });
}
