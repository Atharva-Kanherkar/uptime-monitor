 
 import nodemailer from 'nodemailer';

 const transporter = nodemailer.createTransport({
   service: "Gmail",
   host: "smtp.gmail.com",
   port: 465,
   secure: true,
   auth: {
     user: "atharvakanherkar25@gmail.com",
     pass: "kohu umjf wbur mdtt",
   },
 });
 
 export const sendEmail = async (to: string, subject: string, text: string) => {
   try {
     const info = await transporter.sendMail({
       from: '"Uptime Monitor" <atharvakanherkar25@gmail.com>',
       to,
       subject,
       text,
     });
 
     console.log("Email sent:", info.response);
   } catch (error) {
     console.error("Error sending email:", error);
     throw new Error("Failed to send email");
   }
 };
 