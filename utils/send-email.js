import { emailTemplates } from "./email.template";
import { GMAIL_USER } from "../config/env";
import { transporter } from "../config/nodemailer";

//basically this will send mail
export const sendReminderEmail = async ({ to, type, subscription }) => {
  //check when params are missing
  if (!to || !type || !subscription) {
    throw new Error("Missing parameters for sending reminder email");
  }

  //if it exists we will create email template
  const template = emailTemplates.find((t) => t.label === type); //label is basically 7 5 3 or 1 days before reminder
  if (!template) {
    throw new Error("Invalid email template type");
  }

  //basically mail info coming from subscription
  const mailInfo = {
    userName: subscription.user.name,
    subscriptionName: subscription.name,
    renewalDate: subscription.renewalDate.toDateString(),
    planName: subscription.name,
    price: `$${subscription.price} ${subscription.currency} per ${subscription.frequency}`,
    paymentMethod: subscription.paymentMethod,
  };
  //generate subject and body

  const message = template.generateBody(mailInfo);
  const subject = template.generateSubject(mailInfo);

  //generate mail options
  const mailOptions = {
    from: `"Pratham Dev" <${GMAIL_USER}>`, // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    html: message, // html body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
  } catch (error) {
    console.error("Error occurred while sending email:", error);
  }
};

// //helper function to get days left
// const getDaysLeft = (renewalDate) => {
//   const renewalDateObj = new Date(renewalDate);
//   const currentDate = new Date();

//   //difference in millisecnods
//   const diffTime = renewalDateObj - currentDate;
//   //convert to days
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//   return diffDays;}
