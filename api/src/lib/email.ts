import nodemailer from "nodemailer";

let _transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return _transporter;
}

export async function sendVerificationCode(email: string, code: string) {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"NITAI AI" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Your NITAI AI Login Code",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="color: #7c3aed;">NITAI AI</h1>
        <p>Your verification code is:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 16px; background: #f5f3ff; border-radius: 8px; margin: 16px 0;">
          ${code}
        </div>
        <p style="color: #666;">This code expires in <strong>10 minutes</strong>.</p>
        <p style="color: #999; font-size: 12px;">If you didn't request this code, ignore this email.</p>
      </div>
    `,
  });
}
