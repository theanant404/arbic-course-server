import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

export const sendEmail = async (to, subject, html) => {
    // send mail with defined transport object
    try {
      await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: to, // list of receivers
        
        subject: subject, 
        html: html, 
      });
    } catch (error) {
        console.log(error);
    }
};

