import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const api = new SibApiV3Sdk.TransactionalEmailsApi();

export async function sendVerifyEmail(email, token) {
  await api.sendTransacEmail({
    sender: { email: process.env.BREVO_SENDER_EMAIL },
    to: [{ email }],
    subject: "Verify your account",
    htmlContent: `
      <a href="${process.env.FRONTEND_URL}/verify?token=${token}">
        Verify account
      </a>
    `,
  });
}
