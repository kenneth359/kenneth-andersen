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
      from: "nettside@resend.dev",
      to: "kenneth.andersen2@gmail.com",
      subject: `Henvendelse fra ${name} via kennethandersen.no`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #0F172A; color: #F8FAFC; border-radius: 12px;">
          <div style="border-bottom: 2px solid #D4AF37; padding-bottom: 16px; margin-bottom: 24px;">
            <h2 style="color: #D4AF37; margin: 0; font-size: 20px;">Ny henvendelse via nettsiden</h2>
          </div>
          <p style="margin: 8px 0;"><strong style="color: #94A3B8;">Navn:</strong> ${name}</p>
          <p style="margin: 8px 0;"><strong style="color: #94A3B8;">E-post:</strong> <a href="mailto:${email}" style="color: #D4AF37;">${email}</a></p>
          <div style="margin-top: 20px; padding: 16px; background: #1E293B; border-radius: 8px; border-left: 3px solid #D4AF37;">
            <p style="color: #94A3B8; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.1em;">Melding</p>
            <p style="margin: 0; line-height: 1.7;">${message.replace(/\n/g, "<br>")}</p>
          </div>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
