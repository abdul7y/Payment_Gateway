import nodemailer from "nodemailer";
import { type PaymentFormData } from "@shared/schema";

// Create a test account for development if no email credentials are provided
const createTestAccount = async () => {
  const testAccount = await nodemailer.createTestAccount();
  return {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  };
};

// Generate HTML content for the email
const generateEmailHTML = (data: PaymentFormData) => {
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          h1 { color: #0066cc; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f2f2f2; }
          .footer { margin-top: 30px; font-size: 12px; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Payment Information Submitted</h1>
          <p>The following payment information has been submitted:</p>
          
          <table>
            <tr>
              <th>Field</th>
              <th>Value</th>
            </tr>
            <tr>
              <td>First Name</td>
              <td>${data.firstName}</td>
            </tr>
            <tr>
              <td>Last Name</td>
              <td>${data.lastName}</td>
            </tr>
            <tr>
              <td>Card Number</td>
              <td>${maskCardNumber(data.cardNumber)}</td>
            </tr>
            <tr>
              <td>Expiry Date</td>
              <td>${data.expiry}</td>
            </tr>
            <tr>
              <td>CVV</td>
              <td>***</td>
            </tr>
            <tr>
              <td>Name on Card</td>
              <td>${data.nameOnCard}</td>
            </tr>
            <tr>
              <td>Address</td>
              <td>${data.address}</td>
            </tr>
          </table>
          
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

// Mask the card number for security
const maskCardNumber = (cardNumber: string) => {
  if (cardNumber.length <= 4) {
    return "****";
  }
  const lastFour = cardNumber.slice(-4);
  const maskedPart = "*".repeat(cardNumber.length - 4);
  return maskedPart + lastFour;
};

// Send email with payment information
export const sendPaymentEmail = async (data: PaymentFormData) => {
  try {
    // Get email configuration from environment variables or create a test account
    const emailConfig = process.env.EMAIL_HOST
      ? {
          host: process.env.EMAIL_HOST,
          port: parseInt(process.env.EMAIL_PORT || "587"),
          secure: process.env.EMAIL_SECURE === "true",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        }
      : await createTestAccount();

    // Create a transporter
    const transporter = nodemailer.createTransport(emailConfig);

    // Define email options
    const mailOptions = {
      from: `"Payment Form" <${emailConfig.auth.user}>`,
      to: "Leomonster7868@gmail.com",
      subject: "New Payment Information Submitted",
      html: generateEmailHTML(data),
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    
    console.log("Email sent: %s", info.messageId);
    
    // If using Ethereal email (test account), log the preview URL
    if (emailConfig.host === "smtp.ethereal.email") {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
