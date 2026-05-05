import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { resend } from "@/lib/resend";
import { buildPartnershipEmailHtml } from "@/lib/partnership-email";

export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, business_name, email, phone, website, message } = body;

  const errors: Record<string, string> = {};
  if (!name?.trim()) errors.name = "Name is required";
  if (!business_name?.trim()) errors.business_name = "Business name is required";
  if (!email?.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = "Invalid email format";
  }
  if (!message?.trim()) errors.message = "Message is required";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Validation failed", fields: errors }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { error: insertErr } = await supabase.from("partnership_inquiries").insert({
    name: name.trim(),
    business_name: business_name.trim(),
    email: email.trim(),
    phone: phone?.trim() || null,
    website: website?.trim() || null,
    message: message.trim(),
  });

  if (insertErr) {
    console.error("Partnership insert failed:", insertErr.message);
    return NextResponse.json({ error: "Submission failed. Please try again." }, { status: 500 });
  }

  try {
    await resend.emails.send({
      from: "Billy Knight <tickets@billyknightmovie.com>",
      to: "team@billyknightfilm.com",
      subject: "New Partnership Inquiry",
      html: buildPartnershipEmailHtml({
        name: name.trim(),
        businessName: business_name.trim(),
        email: email.trim(),
        phone: phone?.trim(),
        website: website?.trim(),
        message: message.trim(),
        timestamp: new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
      }),
    });
  } catch (emailErr) {
    console.error("Partnership notification email failed:", emailErr);
  }

  return NextResponse.json({ success: true });
}
