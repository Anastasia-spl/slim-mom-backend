const {
  registration,
  logIn,
  logOut,
  checkCurrentUser,
  getUserInfo
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

const getUserInfoController = async (req, res) => {
  const { userId } = req;
  const userInfo = await getUserInfo(userId);
  res.json({ message: "success", userInfo });
};


module.exports = {
  registrationController,
  logInController,
  logOutController,
  currentUserController,
  getUserInfoController
};
