import { Resend } from "resend";
import { config } from "../config/index.js";

const resend = new Resend(config.RESEND_API_KEY);

export async function sendOtpEmail(
  email: string,
  otp: string | number,
): Promise<void> {
  try {
    const response = await resend.emails.send({
      from: config.CONFIG_MAIL_SEND as string,
      to: email,
      subject: "Verify Your Email Address",
      html: `
        <div
          style="
            margin: 0;
            padding: 40px 20px;
            background-color: #f4f7fb;
            font-family: Arial, Helvetica, sans-serif;
          "
        >
          <div
            style="
              max-width: 520px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 14px;
              overflow: hidden;
              border: 1px solid #e5e7eb;
              box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            "
          >
            <!-- Header -->
            <div
              style="
                background: linear-gradient(135deg, #2563eb, #1d4ed8);
                padding: 32px 24px;
                text-align: center;
              "
            >
              <h1
                style="
                  margin: 0;
                  color: #ffffff;
                  font-size: 28px;
                  font-weight: 700;
                "
              >
                RABTA Railway
              </h1>

              <p
                style="
                  margin-top: 10px;
                  color: #dbeafe;
                  font-size: 15px;
                "
              >
                Email Verification
              </p>
            </div>

            <!-- Body -->
            <div style="padding: 36px 30px;">
              <h2
                style="
                  margin: 0 0 16px;
                  color: #111827;
                  font-size: 24px;
                "
              >
                Welcome 👋
              </h2>

              <p
                style="
                  margin: 0 0 20px;
                  color: #4b5563;
                  font-size: 15px;
                  line-height: 1.7;
                "
              >
                Thank you for registering with
                <strong>RABTA Railway Microservices Backend</strong>.
                Please use the verification code below to complete your email verification.
              </p>

              <!-- OTP Box -->
              <div
                style="
                  margin: 30px 0;
                  text-align: center;
                "
              >
                <div
                  style="
                    display: inline-block;
                    background-color: #eff6ff;
                    color: #1d4ed8;
                    padding: 18px 36px;
                    border-radius: 12px;
                    font-size: 34px;
                    font-weight: bold;
                    letter-spacing: 8px;
                    border: 1px dashed #93c5fd;
                  "
                >
                  ${otp}
                </div>
              </div>

              <p
                style="
                  margin: 0 0 12px;
                  color: #374151;
                  font-size: 15px;
                  line-height: 1.6;
                "
              >
                This verification code will expire in
                <strong>${config.CONFIG_OTP_TTL || 5} minutes</strong>.
              </p>

              <p
                style="
                  margin: 0;
                  color: #6b7280;
                  font-size: 14px;
                  line-height: 1.6;
                "
              >
                If you did not request this email, you can safely ignore it.
              </p>
            </div>

            <!-- Footer -->
            <div
              style="
                padding: 20px 30px;
                background-color: #f9fafb;
                border-top: 1px solid #e5e7eb;
                text-align: center;
              "
            >
              <p
                style="
                  margin: 0;
                  font-size: 13px;
                  color: #9ca3af;
                "
              >
                © ${new Date().getFullYear()} RABTA Railway. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("OTP email sent:", response);
  } catch (error) {
    console.error("Resend error:", error);
    throw error;
  }
}
