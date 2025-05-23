const nodemailer = require("nodemailer");

export default async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests are allowed" });
  }

  // Set CORS headers for preflight requests and actual POST requests
  res.setHeader("Access-Control-Allow-Origin", "*");  // You can restrict this to specific domains in production
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS request (preflight)
  if (req.method === "OPTIONS") {
    return res.status(200).end();  // Preflight request: respond with status 200
  }

  // Extract data from the request body
  const { name, email, query } = req.body.contactmsg;

  // Configure the mail transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,  // Use environment variables for security
      pass: process.env.EMAIL_PASS   // Use environment variables for security
    }
  });

  // Build the HTML email content
  const emailContent = `
    <div style="font-family: Arial, sans-serif; padding: 30px; background-color: #f4f4f4; border-radius: 8px; text-align: center;">
      <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <h2 style="color: #333;">New Client Message</h2>
        <p style="font-size: 16px; color: #555;">You’ve received a message from a potential client. Here are the details:</p>
        <table style="width: 100%; margin-top: 20px; font-size: 16px; color: #444;">
          <tr>
            <td style="font-weight: bold; padding: 10px; text-align: right;">Name:</td>
            <td style="padding: 10px; text-align: left;">${name}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 10px; text-align: right;">Email:</td>
            <td style="padding: 10px; text-align: left;">${email}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 10px; text-align: right; vertical-align: top;">Message:</td>
            <td style="padding: 10px; text-align: left;">${query}</td>
          </tr>
        </table>
        <p style="font-size: 14px; color: #777; margin-top: 30px;">Please reach out to the client using the provided email address.</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,   // Use environment variables for security
    to: 'valarshan2000@gmail.com',  // You can set this dynamically if needed
    subject: 'Client Query',
    html: emailContent
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Mail sent successfully");
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (err) {
    console.error("Email sending failed:", err);
    res.status(500).json({ message: "Failed to send email", error: err });
  }
}
