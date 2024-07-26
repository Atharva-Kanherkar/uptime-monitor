 
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

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
const sendDemoEmail = async (recipientEmail: string) => {
  try {
    const info = await transporter.sendMail({
      from: "UPTIME MONITOR",
      to: recipientEmail,
      subject: 'Enjoy Your Free Trial!',
      text: `Hey, enjoy your free trial!
       Here is the link to get you started : http://localhost:5173/signup`,
     
    });

    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendDemoEmail;
