const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("./emailService");
const { User } = require("../db/userModel");
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
  const existUser = await User.findOne({ email, login });
  // const existEmail = await User.findOne({ email });
  // const existLogin = await User.findOne({ login });
  // if (existEmail || existLogin) {
  if (existUser) {
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

const getUserInfo = async (userId) => {
  const { height, weight, age, desiredWeight, bloodGroup, productsNotAllowed } =
    await User.findById(userId);
  return { height, weight, age, desiredWeight, bloodGroup, productsNotAllowed };
};

const addUserInfo = async ({
  userId,
  height,
  weight,
  desiredWeight,
  bloodGroup,
  age,
  productsNotAllowed,
}) => {
  await User.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        height,
        weight,
        desiredWeight,
        bloodGroup,
        age,
        productsNotAllowed,
      },
    }
  );
};

module.exports = {
  registration,
  logIn,
  logOut,
  checkCurrentUser,
  getUserInfo,
  addUserInfo,
};
