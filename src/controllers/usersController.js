const {
  registration,
  registrationConfirmation,
  logIn,
  logOut,
  checkCurrentUser,
} = require("../services/authService");

const registrationController = async (req, res, next) => {
  const {
    login,
    email,
    password,
    height,
    weight,
    desiredWeight,
    bloodGroup,
    age,
  } = req.body;
  const user = await registration({
    login,
    email,
    password,
    height,
    weight,
    desiredWeight,
    bloodGroup,
    age,
  });
  res.status(201).json({ user });
};

const registrationConfirmationController = async (req, res) => {
  const { code } = req.params;

  await registrationConfirmation(code);
};

const logInController = async (req, res, next) => {
  const { login, password } = req.body;
  const user = await logIn({ login, password });
  return res.status(200).json({ user });
};

const logOutController = async (req, res) => {
  const { userId } = req;
  await logOut(userId);

  res.status(204).json({ message: `No Content - logout success by ${userId}` });
};

const currentUserController = async (req, res) => {
  const { token } = req;
  const user = await checkCurrentUser(token);
  res.json({ message: "success", user });
};

module.exports = {
  registrationController,
  registrationConfirmationController,
  logInController,
  logOutController,
  currentUserController,
};
