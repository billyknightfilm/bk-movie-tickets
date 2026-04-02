import { createServiceClient } from "@/lib/supabase-server";
import { resend } from "@/lib/resend";
import { escapeHtml } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let parsed;
  try {
    parsed = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { audience, screening_id, referral_code, email: specificEmail, subject, body } = parsed;

  if (!subject?.trim() || !body?.trim()) {
    return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
  }

  const validAudiences = ["all", "screening", "creator", "specific"];
  if (!audience || !validAudiences.includes(audience)) {
    return NextResponse.json({ error: "Invalid audience type" }, { status: 400 });
  }

  const db = createServiceClient();

  let emails: string[] = [];

  if (audience === "specific" && specificEmail) {
    emails = [specificEmail];
  } else if (audience === "all") {
    const { data: tickets, error } = await db.from("tickets").select("email");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const unique = new Set((tickets || []).map((t) => t.email).filter(Boolean));
    emails = Array.from(unique);
  } else {
    let query = db.from("tickets").select("email");

    if (audience === "screening" && screening_id) {
      query = query.eq("screening_id", screening_id);
    } else if (audience === "creator" && referral_code) {
      query = query.eq("referral_code", referral_code);
    } else {
      return NextResponse.json({ error: "Missing filter value for audience" }, { status: 400 });
    }

    const { data: tickets, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const unique = new Set((tickets || []).map((t) => t.email).filter(Boolean));
    emails = Array.from(unique);
  }

  if (emails.length === 0) {
    return NextResponse.json({ error: "No recipients found" }, { status: 400 });
  }

  const htmlBody = body
    .split("\n")
    .map((line: string) => (line.trim() === "" ? "<br/>" : `<p style="margin:0 0 8px;font-size:15px;color:#F0E6CC;line-height:1.65;">${escapeHtml(line)}</p>`))
    .join("");

  const emailHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background-color:#0f0c08;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0c08;">
<tr><td align="center" style="padding:48px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
<tr><td style="padding-bottom:24px;border-bottom:1px solid rgba(212,175,55,0.18);">
<p style="margin:0;font-size:10px;font-weight:600;letter-spacing:0.26em;color:rgba(212,175,55,0.65);text-transform:uppercase;">Billy Knight</p>
</td></tr>
<tr><td style="padding:28px 0;">
${htmlBody}
</td></tr>
<tr><td align="center" style="padding-top:24px;border-top:1px solid rgba(212,175,55,0.18);">
<p style="margin:0;font-size:10px;letter-spacing:0.1em;color:rgba(240,230,204,0.15);">&copy; 2026 Billy Knight &mdash; billyknightmovie.com</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;

  let sent = 0;
  const errors: string[] = [];

  for (const to of emails) {
    try {
      await resend.emails.send({
        from: "Billy Knight <tickets@billyknightmovie.com>",
        to,
        subject: subject.trim(),
        html: emailHtml,
      });
      sent++;
    } catch (err) {
      errors.push(`${to}: ${err}`);
    }
  }

  return NextResponse.json({ sent, total: emails.length, errors });
}
