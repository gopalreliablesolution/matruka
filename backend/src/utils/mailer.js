const nodemailer = require('nodemailer');
const Setting = require('../models/Setting');

function createTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass || pass === 'CHANGE_ME_SMTP_APP_PASSWORD') {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Send lead notification email to the clinic (and confirmation to patient if email provided).
 * Runs non-blocking so booking API stays fast even if SMTP is unconfigured or slow.
 */
async function sendLeadNotificationEmails(appointment) {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.warn(
        '[Mailer] SMTP credentials not configured (SMTP_USER / SMTP_PASS missing or placeholder). Skipping lead email.'
      );
      return { sent: false, reason: 'smtp_not_configured' };
    }

    const settings = await Setting.findOne().lean().catch(() => null);
    const clientEmail =
      process.env.LEAD_NOTIFICATION_EMAIL ||
      settings?.email ||
      process.env.SMTP_USER ||
      'Info.matruka@gmail.com';

    const fromAddress =
      process.env.SMTP_FROM || `"Matruka Women's Hospital" <${process.env.SMTP_USER}>`;

    const isInquiry = appointment.department === 'Website Inquiry';
    const leadType = isInquiry ? 'Website Inquiry' : 'Appointment Request';

    const clinicHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: #0496AC; color: #ffffff; padding: 20px 24px;">
          <h2 style="margin: 0; font-size: 18px;">New ${leadType} Received</h2>
          <p style="margin: 4px 0 0; font-size: 12px; opacity: 0.9;">Matruka — Complete Care for Her</p>
        </div>
        <div style="padding: 24px; background: #ffffff; color: #1e293b; font-size: 14px; line-height: 1.6;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #64748b; width: 140px;"><strong>Patient Name:</strong></td><td style="padding: 6px 0;">${escapeHtml(appointment.patientName)}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;"><strong>Phone:</strong></td><td style="padding: 6px 0;"><a href="tel:${escapeHtml(appointment.phone)}" style="color: #0496AC; font-weight: bold;">${escapeHtml(appointment.phone)}</a></td></tr>
            ${appointment.email ? `<tr><td style="padding: 6px 0; color: #64748b;"><strong>Email:</strong></td><td style="padding: 6px 0;">${escapeHtml(appointment.email)}</td></tr>` : ''}
            ${appointment.city ? `<tr><td style="padding: 6px 0; color: #64748b;"><strong>City:</strong></td><td style="padding: 6px 0;">${escapeHtml(appointment.city)}</td></tr>` : ''}
            ${!isInquiry && appointment.doctor ? `<tr><td style="padding: 6px 0; color: #64748b;"><strong>Preferred Doctor:</strong></td><td style="padding: 6px 0;">${escapeHtml(appointment.doctor)}</td></tr>` : ''}
            ${!isInquiry && appointment.preferredDate ? `<tr><td style="padding: 6px 0; color: #64748b;"><strong>Preferred Date:</strong></td><td style="padding: 6px 0;">${escapeHtml(appointment.preferredDate)}</td></tr>` : ''}
            ${!isInquiry && appointment.preferredTime ? `<tr><td style="padding: 6px 0; color: #64748b;"><strong>Preferred Slot:</strong></td><td style="padding: 6px 0;">${escapeHtml(appointment.preferredTime)}</td></tr>` : ''}
            ${appointment.message ? `<tr><td style="padding: 6px 0; color: #64748b; vertical-align: top;"><strong>Message / Notes:</strong></td><td style="padding: 6px 0;">${escapeHtml(appointment.message)}</td></tr>` : ''}
          </table>
        </div>
        <div style="padding: 12px 24px; background: #f8fafc; color: #64748b; font-size: 11px; border-top: 1px solid #e2e8f0;">
          Submitted via Matruka Website (${leadType})
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: fromAddress,
      to: clientEmail,
      replyTo: appointment.email || undefined,
      subject: `[Matruka] New ${leadType}: ${appointment.patientName} (${appointment.phone})`,
      html: clinicHtml,
    });

    // Optional confirmation email to patient if they provided an email address
    if (appointment.email) {
      await transporter
        .sendMail({
          from: fromAddress,
          to: appointment.email,
          subject: `We received your ${leadType.toLowerCase()} | Matruka — Complete Care for Her`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
              <div style="background: #0496AC; color: #ffffff; padding: 18px 24px;">
                <h2 style="margin: 0; font-size: 18px;">Thank You, ${escapeHtml(appointment.patientName)}</h2>
              </div>
              <div style="padding: 22px 24px; color: #334155; font-size: 14px; line-height: 1.6;">
                <p>We have received your ${leadType.toLowerCase()} at <strong>Matruka — Complete Care for Her</strong>.</p>
                <p>Our care desk team will contact you shortly on <strong>${escapeHtml(appointment.phone)}</strong> to assist you.</p>
                <p style="margin-top: 16px; font-size: 12px; color: #64748b;">For urgent assistance, please call +91 ${escapeHtml(settings?.appointmentPhone || '7984882273')}.</p>
              </div>
            </div>
          `,
        })
        .catch((err) => console.warn('[Mailer] Patient confirmation failed:', err.message));
    }

    return { sent: true };
  } catch (err) {
    console.error('[Mailer] Failed to send lead notification email:', err.message);
    return { sent: false, error: err.message };
  }
}

module.exports = { sendLeadNotificationEmails };
