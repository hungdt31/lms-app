import nodemailer from "nodemailer";

const sendEmail = async (email: any, subject: any, text: any) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: 587,
      secure: true,
      service: "Gmail",
      tls: {
        rejectUnauthorized: false,
      },
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
      html: `Mã code có hiệu lực trong 30s: <b>${text}</b>`,
    });

    console.log("Email sent sucessfully");
  } catch (error) {
    console.log(error, "Email not sent");
  }
};

export default sendEmail;
