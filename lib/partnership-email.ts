import { escapeHtml } from "./utils";

interface PartnershipEmailProps {
  name: string;
  businessName: string;
  email: string;
  phone?: string;
  website?: string;
  message: string;
  timestamp: string;
}

export function buildPartnershipEmailHtml(props: PartnershipEmailProps): string {
  const { name, businessName, email, phone, website, message, timestamp } = props;

  const rows = [
    { label: "Name", value: escapeHtml(name) },
    { label: "Business Name", value: escapeHtml(businessName) },
    { label: "Email", value: escapeHtml(email) },
    ...(phone ? [{ label: "Phone", value: escapeHtml(phone) }] : []),
    ...(website ? [{ label: "Website / Social", value: escapeHtml(website) }] : []),
    { label: "Message", value: escapeHtml(message).replace(/\n/g, "<br/>") },
    { label: "Submitted", value: escapeHtml(timestamp) },
  ];

  const rowsHtml = rows
    .map(
      (r) => `<tr>
        <td style="padding:10px 0;border-bottom:1px solid rgba(255,252,245,0.06);">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="width:120px;vertical-align:top;"><p style="margin:0;font-size:10px;font-weight:600;letter-spacing:0.16em;color:rgba(240,230,204,0.32);text-transform:uppercase;">${r.label}</p></td>
            <td><p style="margin:0;font-size:14px;color:rgba(240,230,204,0.75);">${r.value}</p></td>
          </tr></table>
        </td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>New Partnership Inquiry</title>
</head>
<body style="margin:0;padding:0;background-color:#0f0c08;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0c08;">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
          <tr>
            <td style="padding-bottom:24px;">
              <p style="margin:0;font-size:10px;font-weight:600;letter-spacing:0.26em;color:rgba(212,175,55,0.65);text-transform:uppercase;">
                New Partnership Inquiry
              </p>
              <p style="margin:8px 0 0;font-size:24px;font-weight:700;letter-spacing:0.04em;color:#F0E6CC;text-transform:uppercase;line-height:1;">
                ${escapeHtml(businessName)}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 0 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${rowsHtml}
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:32px 0 0;">
              <p style="margin:0;font-size:10px;letter-spacing:0.1em;color:rgba(240,230,204,0.15);">
                &copy; 2026 Billy Knight &mdash; billyknightmovie.com
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
