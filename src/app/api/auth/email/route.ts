import { NextRequest, NextResponse } from "next/server";
import { sendVerificationCode } from "@/lib/email";
import { setEmailCode, isEmailCodeSentRecently } from "@/lib/email-code-cache";

const CODE_LEN = 6;

function generateCode(): string {
  const digits = "0123456789";
  let code = "";
  for (let i = 0; i < CODE_LEN; i++) {
    code += digits[Math.floor(Math.random() * digits.length)];
  }
  return code;
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "请输入邮箱地址" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "邮箱格式不正确" }, { status: 400 });
    }

    if (isEmailCodeSentRecently(email)) {
      return NextResponse.json(
        { error: "发送过于频繁，请 60 秒后再试" },
        { status: 429 },
      );
    }

    const code = generateCode();
    await sendVerificationCode(email, code);
    setEmailCode(email, code);

    return NextResponse.json({ message: "验证码已发送" });
  } catch (e) {
    console.error("POST /api/auth/email error:", e);
    return NextResponse.json({ error: "发送验证码失败，请稍后重试" }, { status: 500 });
  }
}
