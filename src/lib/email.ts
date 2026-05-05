import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASSWORD || "",
      },
    });
  }
  return transporter;
}

export async function sendVerificationCode(
  to: string,
  code: string,
): Promise<void> {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "";
  const senderName = process.env.SMTP_SENDER_NAME || "ShakeWords";

  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"${senderName}" <${from}>`,
    to,
    subject: "ShakeWords 验证码",
    html: `
      <div style="max-width:480px;margin:0 auto;padding:32px;font-family:system-ui,-apple-system,sans-serif;">
        <h2 style="margin:0 0 24px;color:#1e293b;font-size:20px;">ShakeWords 验证码</h2>
        <p style="margin:0 0 16px;color:#475569;font-size:15px;">您正在登录 ShakeWords，验证码为：</p>
        <div style="display:inline-block;padding:12px 32px;background:#f1f5f9;border-radius:8px;font-size:28px;font-weight:700;letter-spacing:6px;color:#0f172a;">${code}</div>
        <p style="margin:16px 0 0;color:#94a3b8;font-size:13px;">验证码 5 分钟内有效，请勿泄露给他人。</p>
      </div>
    `,
  });
}

export async function sendVerifyLink(
  to: string,
  verifyUrl: string,
): Promise<void> {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "";
  const senderName = process.env.SMTP_SENDER_NAME || "ShakeWords";

  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"${senderName}" <${from}>`,
    to,
    subject: "验证您的 ShakeWords 邮箱",
    html: `
      <div style="max-width:480px;margin:0 auto;padding:32px;font-family:system-ui,-apple-system,sans-serif;">
        <h2 style="margin:0 0 24px;color:#1e293b;font-size:20px;">验证您的邮箱</h2>
        <p style="margin:0 0 16px;color:#475569;font-size:15px;">请点击下方按钮验证您的邮箱地址：</p>
        <a href="${verifyUrl}" style="display:inline-block;padding:12px 32px;background:#6366f1;color:#fff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:600;">验证邮箱</a>
        <p style="margin:16px 0 0;color:#94a3b8;font-size:13px;">链接 30 分钟内有效。如果您没有请求验证，请忽略此邮件。</p>
        <p style="margin:8px 0 0;color:#94a3b8;font-size:12px;">如果按钮无法点击，请复制以下链接到浏览器打开：<br/><a href="${verifyUrl}" style="color:#6366f1;word-break:break-all;">${verifyUrl}</a></p>
      </div>
    `,
  });
}
