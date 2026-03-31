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

  const firstName = fullName.split(" ")[0];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Your Billy Knight Ticket</title>
</head>
<body style="margin:0;padding:0;background-color:#0f0c08;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0c08;">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:36px;">
              <p style="margin:0;font-size:10px;font-weight:600;letter-spacing:0.26em;color:rgba(212,175,55,0.65);text-transform:uppercase;">
                Booking Confirmed
              </p>
              <p style="margin:8px 0 0;font-size:36px;font-weight:800;letter-spacing:0.04em;color:#F0E6CC;text-transform:uppercase;line-height:1;">
                You&rsquo;re In, ${firstName}.
              </p>
            </td>
          </tr>

          <!-- Confirmation Number -->
          <tr>
            <td style="padding:24px 0;border-top:1px solid rgba(212,175,55,0.18);border-bottom:1px solid rgba(212,175,55,0.18);">
              <p style="margin:0;font-size:9px;font-weight:600;letter-spacing:0.26em;color:rgba(240,230,204,0.3);text-transform:uppercase;">
                Confirmation Number
              </p>
              <p style="margin:8px 0 0;font-size:28px;font-weight:600;letter-spacing:0.12em;color:#D4AF37;line-height:1;">
                ${ticketNumber}
              </p>
              <p style="margin:8px 0 0;font-size:11px;letter-spacing:0.04em;color:rgba(240,230,204,0.3);">
                Save this number for your records.
              </p>
            </td>
          </tr>

          <!-- Order Details -->
          <tr>
            <td style="padding:24px 0 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <!-- Screening -->
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid rgba(255,252,245,0.06);">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
                      <td><p style="margin:0;font-size:10px;font-weight:600;letter-spacing:0.16em;color:rgba(240,230,204,0.32);text-transform:uppercase;">Screening</p></td>
                      <td align="right"><p style="margin:0;font-size:14px;color:rgba(240,230,204,0.75);">${venueName}</p></td>
                    </tr></table>
                  </td>
                </tr>
                <!-- Location -->
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid rgba(255,252,245,0.06);">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
                      <td><p style="margin:0;font-size:10px;font-weight:600;letter-spacing:0.16em;color:rgba(240,230,204,0.32);text-transform:uppercase;">Location</p></td>
                      <td align="right"><p style="margin:0;font-size:14px;color:rgba(240,230,204,0.75);">${city}, ${state}</p></td>
                    </tr></table>
                  </td>
                </tr>
                <!-- Address -->
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid rgba(255,252,245,0.06);">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
                      <td><p style="margin:0;font-size:10px;font-weight:600;letter-spacing:0.16em;color:rgba(240,230,204,0.32);text-transform:uppercase;">Address</p></td>
                      <td align="right"><p style="margin:0;font-size:14px;color:rgba(240,230,204,0.75);">${address}</p></td>
                    </tr></table>
                  </td>
                </tr>
                <!-- Date -->
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid rgba(255,252,245,0.06);">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
                      <td><p style="margin:0;font-size:10px;font-weight:600;letter-spacing:0.16em;color:rgba(240,230,204,0.32);text-transform:uppercase;">Date</p></td>
                      <td align="right"><p style="margin:0;font-size:14px;color:rgba(240,230,204,0.75);">${formatDate(date)}</p></td>
                    </tr></table>
                  </td>
                </tr>
                <!-- Time -->
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid rgba(255,252,245,0.06);">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
                      <td><p style="margin:0;font-size:10px;font-weight:600;letter-spacing:0.16em;color:rgba(240,230,204,0.32);text-transform:uppercase;">Time</p></td>
                      <td align="right"><p style="margin:0;font-size:14px;color:rgba(240,230,204,0.75);">${formatTime(time)}</p></td>
                    </tr></table>
                  </td>
                </tr>
                <!-- Tickets -->
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid rgba(255,252,245,0.06);">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
                      <td><p style="margin:0;font-size:10px;font-weight:600;letter-spacing:0.16em;color:rgba(240,230,204,0.32);text-transform:uppercase;">Tickets</p></td>
                      <td align="right"><p style="margin:0;font-size:14px;color:rgba(240,230,204,0.75);">${quantity} &times; $${pricePerTicket.toFixed(2)}</p></td>
                    </tr></table>
                  </td>
                </tr>
                <!-- Total -->
                <tr>
                  <td style="padding:10px 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
                      <td><p style="margin:0;font-size:10px;font-weight:600;letter-spacing:0.16em;color:rgba(240,230,204,0.32);text-transform:uppercase;">Total Paid</p></td>
                      <td align="right"><p style="margin:0;font-size:15px;font-weight:600;color:#F0E6CC;">$${total.toFixed(2)}</p></td>
                    </tr></table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Seat Selection Notice -->
          <tr>
            <td style="padding:24px 0 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.2);border-radius:8px;padding:18px 20px;">
                    <p style="margin:0 0 6px;font-size:10px;font-weight:700;letter-spacing:0.18em;color:rgba(212,175,55,0.8);text-transform:uppercase;">
                      &#9679; Seat Selection
                    </p>
                    <p style="margin:0;font-size:13px;line-height:1.65;color:rgba(240,230,204,0.6);">
                      You will receive an email closer to the release date with your seat selection details and everything you need for the evening. Keep your confirmation number handy.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:32px 0 0;">
              <p style="margin:0;font-size:11px;letter-spacing:0.06em;color:rgba(240,230,204,0.25);line-height:1.7;">
                Questions? <a href="mailto:contact@billyknightmovie.com" style="color:rgba(212,175,55,0.5);text-decoration:none;">contact@billyknightmovie.com</a>
              </p>
              <p style="margin:16px 0 0;font-size:10px;letter-spacing:0.1em;color:rgba(240,230,204,0.15);">
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
