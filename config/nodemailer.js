import nodemailer from "nodemailer";
import { GMAIL_PASS, GMAIL_USER } from "./env.js";

// Create a transporter using SMTP
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

//code to verify connection
try {
  await transporter.verify();
  console.log("SMTP connection successful");
} catch (error) {
  console.log(error);
}
