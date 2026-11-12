/**
 * Email service using Nodemailer.
 * Sends confirmation emails to customer and admin.
 *
 * Transport (chosen by environment variables):
 *  - AWS SES SMTP when SES_SMTP_USER and SES_SMTP_PASS are set (preferred).
 *    Region eu-central-1; the From address must be a verified SES identity
 *    (info@aydence.de is). SMTP credentials come from an IAM user with only
 *    ses:SendRawEmail, converted to SMTP credentials (not the raw access keys).
 *  - Gmail SMTP otherwise (GMAIL_USER, GMAIL_APP_PASSWORD). Kept as a fallback
 *    until the SES credentials exist on the server.
 */

import nodemailer from 'nodemailer';
import { formatDateForDisplay, formatTimeForDisplay } from './courses';

const useSes = Boolean(process.env.SES_SMTP_USER && process.env.SES_SMTP_PASS);

const transporter = useSes
  ? nodemailer.createTransport({
      host: process.env.SES_SMTP_HOST || 'email-smtp.eu-central-1.amazonaws.com',
      port: 587, // STARTTLS
      secure: false,
      auth: { user: process.env.SES_SMTP_USER, pass: process.env.SES_SMTP_PASS },
    })
  : nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

// With SES, EMAIL_FROM must use a verified identity, e.g. "Aydence <info@aydence.de>".
const EMAIL_FROM = process.env.EMAIL_FROM || (useSes ? 'Aydence <info@aydence.de>' : `Aydence <${process.env.GMAIL_USER}>`);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@aydence.de';

interface BookingEmailData {
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  courseName: string;
  bookingDate: string;     // "YYYY-MM-DD"
  startTime: string;       // "HH:mm"
  endTime: string;         // "HH:mm"
  notes?: string;
  createdAt: Date;
}

/**
 * Send confirmation email to the customer.
 */
export async function sendCustomerConfirmation(data: BookingEmailData): Promise<{ success: boolean; error?: string }> {
  const displayDate = formatDateForDisplay(data.bookingDate);
  const displayTime = formatTimeForDisplay(data.startTime, data.endTime);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f8f9fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1a2e6b,#2563eb);border-radius:16px 16px 0 0;padding:32px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">Thank you!</h1>
    </div>
    
    <!-- Body -->
    <div style="background:#ffffff;padding:32px;border-radius:0 0 16px 16px;border:1px solid #e5e7eb;border-top:none;">
      <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
        Hello <strong>${data.customerName}</strong>,
      </p>
      <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
        Thank you! I will confirm your appointment by email shortly.<br><br>Your requested appointment:
      </p>

      <!-- Booking Details Card -->
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#6b7280;font-size:13px;font-weight:500;">SESSION</td>
            <td style="padding:8px 0;color:#111827;font-size:14px;font-weight:600;text-align:right;">${data.courseName}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6b7280;font-size:13px;font-weight:500;border-top:1px solid #e5e7eb;">DATE</td>
            <td style="padding:8px 0;color:#111827;font-size:14px;font-weight:600;text-align:right;border-top:1px solid #e5e7eb;">${displayDate}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6b7280;font-size:13px;font-weight:500;border-top:1px solid #e5e7eb;">TIME</td>
            <td style="padding:8px 0;color:#111827;font-size:14px;font-weight:600;text-align:right;border-top:1px solid #e5e7eb;">${displayTime}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6b7280;font-size:13px;font-weight:500;border-top:1px solid #e5e7eb;">BOOKING ID</td>
            <td style="padding:8px 0;color:#111827;font-size:14px;font-weight:600;text-align:right;border-top:1px solid #e5e7eb;">${data.bookingId}</td>
          </tr>
        </table>
      </div>

      <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;text-align:center;">
        If you have any questions, simply reply to this email.
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:24px 0;color:#9ca3af;font-size:12px;">
      <p style="margin:0;">Aydence – Speaking Coaching (B1 Level) with Dr. Shoba Kapoor</p>
    </div>
  </div>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: data.customerEmail,
      subject: 'Your free trial session request - Aydence',
      html,
    });
    return { success: true };
  } catch (err: unknown) {
    console.error('Customer email send error:', err);
    const message = err instanceof Error ? err.message : 'Unknown email error';
    return { success: false, error: message };
  }
}

/**
 * Send notification email to the admin.
 */
export async function sendAdminNotification(data: BookingEmailData): Promise<{ success: boolean; error?: string }> {
  const displayDate = formatDateForDisplay(data.bookingDate);
  const displayTime = formatTimeForDisplay(data.startTime, data.endTime);
  const timestamp = data.createdAt.toISOString();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="margin:0;padding:0;background:#f8f9fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;padding:32px;">
      <h2 style="margin:0 0 20px;color:#111827;font-size:18px;">📋 New Trial Session Request</h2>
      
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-bottom:20px;">
        <p style="margin:0;color:#166534;font-size:14px;font-weight:600;">Booking ID: ${data.bookingId}</p>
      </div>

      <h3 style="margin:0 0 12px;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Customer Details</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:13px;">Name</td>
          <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:600;">${data.customerName}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:13px;">Email</td>
          <td style="padding:6px 0;color:#111827;font-size:14px;"><a href="mailto:${data.customerEmail}" style="color:#2563eb;">${data.customerEmail}</a></td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:13px;">Phone</td>
          <td style="padding:6px 0;color:#111827;font-size:14px;">${data.customerPhone || 'Not provided'}</td>
        </tr>
      </table>

      <h3 style="margin:0 0 12px;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Course Details</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:13px;">Course</td>
          <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:600;">${data.courseName}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:13px;">Date</td>
          <td style="padding:6px 0;color:#111827;font-size:14px;">${displayDate}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:13px;">Time</td>
          <td style="padding:6px 0;color:#111827;font-size:14px;">${displayTime}</td>
        </tr>
      </table>

      <h3 style="margin:0 0 12px;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Details</h3>
      <p style="margin:0 0 20px;color:#374151;font-size:14px;background:#f9fafb;padding:12px;border-radius:8px;">
        ${(data.notes || 'None').replace(/\n/g, '<br>')}
      </p>

      <div style="border-top:1px solid #e5e7eb;padding-top:16px;">
        <p style="margin:0;color:#9ca3af;font-size:12px;">Timestamp: ${timestamp}</p>
      </div>
    </div>
  </div>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: ADMIN_EMAIL,
      replyTo: data.customerEmail,
      subject: `New trial session request: ${data.customerName}`,
      html,
    });
    return { success: true };
  } catch (err: unknown) {
    console.error('Admin email send error:', err);
    const message = err instanceof Error ? err.message : 'Unknown email error';
    return { success: false, error: message };
  }
}
