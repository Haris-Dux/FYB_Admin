import nodemailer from "nodemailer";

export async function sendEmail(to, from) {
  const { email, g_Otp , orderProgress , orderId , subject } = to;

  let output = "";

  if(subject === "Reset Password Email"){
    output = `
  <h3>Password Reset Code</h3>

  <p>This link will expire in 15 minutes</p>
  <p> ${g_Otp}</p>
`;
  };

  if(subject === "Order Status Updated"){
    output = `
  <h3>Your Order status Has Been Updated</h3>
  
  <p>Order Id : ${orderId}</p>
  <p>Order Progress : ${orderProgress}</p>
`;
  }

  let transport = nodemailer.createTransport({
    host: "smtp.titan.email",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_AUTH_USER_EMAIL,
      pass: process.env.EMAIL_AUTH_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let mailoptions = {
    from: process.env.EMAIL_AUTH_USER_EMAIL,
    to: email ,
    subject: subject,
    html: output,
  };

  transport.sendMail(mailoptions, (error, info) => {
    if (error) {
      return false;
    }
    return true;
  });
}
