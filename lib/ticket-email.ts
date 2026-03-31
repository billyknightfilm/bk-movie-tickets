interface TicketEmailProps {
  ticketNumber: string;
  fullName: string;
  venueName: string;
  address: string;
  city: string;
  state: string;
  date: string;
  time: string;
  quantity: number;
  pricePerTicket: number;
  total: number;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h12}:${m} ${ampm}`;
}

export function buildTicketEmailHtml(props: TicketEmailProps): string {
  const {
    ticketNumber,
    fullName,
    venueName,
    address,
    city,
    state,
    date,
    time,
    quantity,
    pricePerTicket,
    total,
  } = props;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Your Billy Knight Ticket</title>
</head>
<body style="margin:0;padding:0;background-color:#080c12;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#080c12;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <p style="margin:0;font-size:22px;font-weight:700;letter-spacing:0.12em;color:#ffffff;">
                BILLY KNIGHT
              </p>
              <p style="margin:6px 0 0;font-size:11px;letter-spacing:0.2em;color:rgba(255,255,255,0.3);text-transform:uppercase;">
                Official Theatrical Experience
              </p>
            </td>
          </tr>

          <!-- Ticket Card -->
          <tr>
            <td style="background:linear-gradient(135deg,rgba(19,34,64,0.6),rgba(11,21,37,0.7));border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:32px 28px;">

              <!-- Confirmation Badge -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <div style="width:48px;height:48px;border-radius:50%;background:rgba(240,201,58,0.1);border:1px solid rgba(240,201,58,0.2);display:inline-block;line-height:48px;text-align:center;">
                      <span style="font-size:22px;">&#10003;</span>
                    </div>
                    <p style="margin:12px 0 0;font-size:18px;color:#f5f0e8;font-weight:300;font-style:italic;">
                      Payment confirmed.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="height:1px;background:rgba(255,255,255,0.06);"></td></tr>
              </table>

              <!-- Ticket Number -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:20px 0;">
                    <p style="margin:0;font-size:10px;letter-spacing:0.25em;color:rgba(255,255,255,0.3);text-transform:uppercase;">
                      Ticket Number
                    </p>
                    <p style="margin:6px 0 0;font-size:24px;font-weight:700;letter-spacing:0.08em;color:#f0c93a;">
                      ${ticketNumber}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="height:1px;background:rgba(255,255,255,0.06);"></td></tr>
              </table>

              <!-- Screening Details -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:20px 0 0;">
                    <p style="margin:0;font-size:10px;letter-spacing:0.25em;color:rgba(255,255,255,0.3);text-transform:uppercase;">
                      Venue
                    </p>
                    <p style="margin:6px 0 0;font-size:16px;color:#f5f0e8;font-weight:600;">
                      ${venueName}
                    </p>
                    <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.35);">
                      ${address}, ${city}, ${state}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 0 0;">
                    <p style="margin:0;font-size:10px;letter-spacing:0.25em;color:rgba(255,255,255,0.3);text-transform:uppercase;">
                      Date &amp; Time
                    </p>
                    <p style="margin:6px 0 0;font-size:16px;color:#f5f0e8;font-weight:600;">
                      ${formatDate(date)}
                    </p>
                    <p style="margin:4px 0 0;font-size:15px;color:rgba(255,255,255,0.5);">
                      ${formatTime(time)}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding-top:20px;">
                <tr><td style="height:1px;background:rgba(255,255,255,0.06);"></td></tr>
              </table>

              <!-- Order Details -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:20px 0 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <p style="margin:0;font-size:10px;letter-spacing:0.25em;color:rgba(255,255,255,0.3);text-transform:uppercase;">Name</p>
                          <p style="margin:4px 0 0;font-size:14px;color:#f5f0e8;">${fullName}</p>
                        </td>
                        <td align="right">
                          <p style="margin:0;font-size:10px;letter-spacing:0.25em;color:rgba(255,255,255,0.3);text-transform:uppercase;">Tickets</p>
                          <p style="margin:4px 0 0;font-size:14px;color:#f5f0e8;">${quantity} &times; $${pricePerTicket.toFixed(2)}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Total -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                <tr>
                  <td style="background:rgba(240,201,58,0.06);border:1px solid rgba(240,201,58,0.1);border-radius:10px;padding:14px 16px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.1em;">Total Paid</p>
                        </td>
                        <td align="right">
                          <p style="margin:0;font-size:24px;font-weight:700;color:#f0c93a;">$${total.toFixed(2)}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer Note -->
          <tr>
            <td align="center" style="padding:28px 20px 0;">
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.25);line-height:1.7;">
                Present this email at the venue entrance.<br/>
                Seat selection details will be sent closer to the screening date.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:28px 0 0;">
              <p style="margin:0;font-size:10px;letter-spacing:0.1em;color:rgba(255,255,255,0.15);">
                &copy; 2026 Billy Knight Film &mdash; billyknightmovie.com
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
