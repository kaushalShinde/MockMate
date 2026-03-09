
import dotenv from "dotenv";
dotenv.config({
    path: "./.env",
});



import SibApiV3Sdk from "sib-api-v3-sdk";


const client = SibApiV3Sdk.ApiClient.instance;

const apiKeyAuth = client.authentications["api-key"];

apiKeyAuth.apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

export async function sendEmail({ to, subject, text, html }) {
  try {
    console.log("sending brevo email");

    const email = {
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: "MockMate"
      },
      to: [{ email: to }],
      subject,
      textContent: text,
      htmlContent: html
    };

    const response = await emailApi.sendTransacEmail(email);

    console.log("sent brevo email");
    return response;

  } catch (error) {
    console.error("brevo email error:", error);
    throw error;
  }
}