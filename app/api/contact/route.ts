import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY not set");
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
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
      reply_to: email,
      subject: `Henvendelse fra ${name} via kennethandersen.no`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #0A0A0B; color: #F2F2F0; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="border-bottom: 2px solid #FF6B35; padding-bottom: 16px; margin-bottom: 24px;">
            <h2 style="color: #FF6B35; margin: 0; font-size: 18px; font-family: monospace; letter-spacing: 0.1em; text-transform: uppercase;">Ny henvendelse · kennethandersen.no</h2>
          </div>
          <p style="margin: 8px 0; font-size: 15px;"><strong style="color: #8E8E94; font-family: monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;">Fra:</strong> ${name}</p>
          <p style="margin: 8px 0; font-size: 15px;"><strong style="color: #8E8E94; font-family: monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;">Svar til:</strong> <a href="mailto:${email}" style="color: #FF6B35;">${email}</a></p>
          <div style="margin-top: 24px; padding: 20px; background: #131316; border-radius: 8px; border-left: 3px solid #FF6B35;">
            <p style="color: #8E8E94; font-family: monospace; font-size: 11px; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.1em;">Melding</p>
            <p style="margin: 0; line-height: 1.7; font-size: 15px;">${message.replace(/\n/g, "<br>")}</p>
          </div>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Resend error:", errText);
    return NextResponse.json({ error: "Failed to send", detail: errText }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
