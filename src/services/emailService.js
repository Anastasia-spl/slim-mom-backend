const nodemailer = require("nodemailer");

async function sendEmail(code, email) {
  const transporter = nodemailer.createTransport(
    {
      service: "yahoo",
      auth: {
        user: "slimmomgroup5@yahoo.com",
        pass: "pweigfhhytxbzhnp",
      },
    },
    { from: "slimmomgroup5@yahoo.com" }
  );
  await transporter.sendMail({
    to: email,
    subject: "✔ Congratulations! You are successfully registred on our site",
    text: `Hello! Thank you for registering at your website. Please, verify your email here! http://localhost:3000/users/registration_confirmation/${code}`,
    html: `<b>Hello! Thank you for registering at your website. Please, verify your email here! </b> <a href="http://localhost:3000/users/registration_confirmation/${code}">Click here verify</a>`,
  });
}

module.exports = { sendEmail };
