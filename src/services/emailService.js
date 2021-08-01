const nodemailer = require("nodemailer");

async function sendEmail(login, email) {
  const transporter = nodemailer.createTransport(
    {
      service: "yahoo",
      auth: {
        user: "slimmomgroup5@yahoo.com",
        pass: "pweigfhhytxbzhnp",
      },
      from: "slimmomgroup5@yahoo.com",
    },
    { from: "slimmomgroup5@yahoo.com" }
  );
  await transporter.sendMail({
    to: email,
    subject:
      "✔ Congratulations! You have successfully registered on our website!",
    text: `Hello! Thank you for registering on our website! A quick reminder : your Login is ${login}`,
    html: `<h1>Hello!</h1> </br> <p>Thank you for registering at our website!</p> </br> <p>Your Login : <h2>${login}</h2></p>`,
  });
}

module.exports = { sendEmail };
