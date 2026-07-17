const { Resend } = require('resend');
const env = require('../config/env');

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

/**
 * Send OTP verification email using Resend
 * @param {string} email - Recipient email
 * @param {string} otp - 6-digit OTP code
 */
const sendOtpEmail = async (email, otp) => {
  if (!resend) {
    const errMsg = 'Resend API Key is not configured';
    console.error(`[Email Service Error]: ${errMsg}`);
    throw new Error(errMsg);
  }

  const fromAddress = env.EMAIL_FROM || 'DayTree <noreply@yourdomain.com>';
  console.log(`[Email Service]: Sent OTP ${otp} to ${email}`);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Verify your DayTree account</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; -webkit-font-smoothing: antialiased;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9fafb; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                <!-- Header -->
                <tr>
                  <td align="center" style="padding: 32px 32px 16px 32px; border-bottom: 1px solid #f3f4f6;">
                    <div style="font-size: 24px; font-weight: 800; color: #4f46e5; letter-spacing: -0.025em; font-family: sans-serif;">
                      🌳 DayTree
                    </div>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding: 32px 32px 24px 32px;">
                    <p style="font-size: 16px; line-height: 24px; color: #1f2937; margin: 0 0 16px 0;">Hello,</p>
                    <p style="font-size: 16px; line-height: 24px; color: #4b5563; margin: 0 0 24px 0;">
                      Thank you for creating an account with DayTree. Please use the following 6-digit verification code to verify your email address.
                    </p>
                    
                    <!-- OTP Box -->
                    <div style="background-color: #f3f4f6; border-radius: 8px; padding: 18px; text-align: center; margin: 0 0 24px 0;">
                      <span style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #111827; font-family: monospace;">
                        ${otp}
                      </span>
                    </div>

                    <p style="font-size: 14px; line-height: 20px; color: #9ca3af; margin: 0 0 24px 0; text-align: center;">
                      This code is valid for <strong>10 minutes</strong>.
                    </p>

                    <p style="font-size: 14px; line-height: 20px; color: #9ca3af; margin: 0;">
                      If you did not request this email, you can safely ignore it.
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td align="center" style="padding: 24px 32px; background-color: #f9fafb; border-top: 1px solid #f3f4f6;">
                    <p style="font-size: 12px; font-weight: 600; color: #4f46e5; letter-spacing: 0.05em; text-transform: uppercase; margin: 0 0 4px 0;">
                      Grow Daily. Stay Consistent.
                    </p>
                    <p style="font-size: 11px; color: #9ca3af; margin: 0;">
                      &copy; 2026 DayTree. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  try {
    const response = await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: 'Verify your DayTree account',
      html: htmlContent,
    });

    if (response.error) {
      console.error('[Resend SDK Error Response]:', response.error);
      throw new Error(response.error.message || 'Failed to send email via Resend');
    }

    return response;
  } catch (error) {
    console.error('[Resend Error exception]:', error.message);
    throw error;
  }
};

module.exports = {
  sendOtpEmail,
};
