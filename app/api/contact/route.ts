import { NextRequest, NextResponse } from "next/server";

function esc(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body ?? {};

    if (
      typeof name !== "string" || typeof email !== "string" || typeof message !== "string" ||
      !name.trim() || !message.trim() ||
      name.length > 200 || email.length > 320 || message.length > 5000 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
    }
    const safeName = esc(name.trim());
    const safeEmail = esc(email.trim());
    const safeMessage = esc(message.trim()).replace(/\n/g, "<br>");

    const apiKey = process.env.RESEND_API_KEY?.replace(/^﻿/, "").trim();
    if (!apiKey) {
      return NextResponse.json({ error: "No API key" }, { status: 500 });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: "kenneth.andersen2@gmail.com",
        reply_to: email.trim(),
        subject: `Henvendelse fra ${name.trim().slice(0, 80).replace(/[\r\n]/g, " ")} via kennethandersen.no`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #0A0A0B; color: #F2F2F0; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="border-bottom: 2px solid #FF6B35; padding-bottom: 16px; margin-bottom: 24px;">
              <h2 style="color: #FF6B35; margin: 0; font-size: 18px; font-family: monospace; letter-spacing: 0.1em; text-transform: uppercase;">Ny henvendelse · kennethandersen.no</h2>
            </div>
            <p style="margin: 8px 0; font-size: 15px;"><strong style="color: #8E8E94; font-family: monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;">Fra:</strong> ${safeName}</p>
            <p style="margin: 8px 0; font-size: 15px;"><strong style="color: #8E8E94; font-family: monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;">Svar til:</strong> <a href="mailto:${safeEmail}" style="color: #FF6B35;">${safeEmail}</a></p>
            <div style="margin-top: 24px; padding: 20px; background: #131316; border-radius: 8px; border-left: 3px solid #FF6B35;">
              <p style="color: #8E8E94; font-family: monospace; font-size: 11px; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.1em;">Melding</p>
              <p style="margin: 0; line-height: 1.7; font-size: 15px;">${safeMessage}</p>
            </div>
          </div>
        `,
      }),
    });

    const resBody = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("Resend failed", resBody);
      return NextResponse.json({ error: "Send failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: (resBody as { id?: string }).id });
  } catch (err) {
    console.error("Contact route error", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
