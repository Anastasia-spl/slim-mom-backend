const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
// const sha256 = require("sha256");

const { sendEmail } = require("./emailService");
const { User } = require("../db/userModel");
// const { Verification } = require("../db/verificationModel");
const {
  NotAuthorizedError,
  RegistrationConflictError,
} = require("../helpers/errors");

const logIn = async ({ login, email, password }) => {
  const user = await User.findOne({ login });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new NotAuthorizedError(`Wrong password or login`);
  }

  const token = jwt.sign(
    {
      _id: user._id,
      login: user.login,
    },
    process.env.JWT_SECRET
  );

  await User.findByIdAndUpdate(user._id, { $set: { token } }, { new: true });
  return { token, email, login };
};

const registration = async ({
  login,
  email,
  password,
  height,
  weight,
  desiredWeight,
  bloodGroup,
  age,
}) => {
  const existEmail = await User.findOne({ email });
  const existLogin = await User.findOne({ login });
  if (existEmail || existLogin) {
    throw new RegistrationConflictError("Email or login is already used");
  }
  const user = new User({
    login,
    email,
    password,
    height,
    weight,
    desiredWeight,
    bloodGroup,
    age,
  });
  await user.save();

  // const code = sha256(email + process.env.JWT_SECRET);

  // const verification = new Verification({
  //   code,
  //   userId: user._id,
  // });
  // await verification.save();

  await sendEmail(login, email);

  return logIn({ login, email, password });
};

const logOut = async (userId) => {
  const logoutUser = await User.findOneAndUpdate(
    { _id: userId },
    { $set: { token: null } },
    { new: true }
  );

  if (!logoutUser) {
    throw new NotAuthorizedError("Not authorized");
  }

  return logoutUser;
};

const checkCurrentUser = async (token) => {
  const user = await User.findOne({ token }).select({
    password: 0,
    __v: 0,
    _id: 0,
  });

  return user;
};

// const registrationConfirmation = async (code) => {
//   const verification = await Verification.findOne({
//     code,
//     active: true,
//   });

//   if (!verification) {
//     throw new NotAuthorizedError("Invalid or expired confirmation code!");
//   }

//   const user = await User.findById(verification.userId);

//   if (!user) {
//     throw new NotAuthorizedError("No user found!");
//   }

//   verification.active = false;
//   await verification.save();

//   user.confirmed = true;
//   await user.save();

//   return user;
// };

module.exports = {
  registration,
  logIn,
  logOut,
  checkCurrentUser,
  // registrationConfirmation,
};
