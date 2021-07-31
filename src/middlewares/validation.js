const Joi = require("joi");

const checkValidation = (schema, req, res, next) => {
  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json({ status: validationResult.error.message });
  }
  next();
};

const userRegistrationValidation = (req, res, next) => {
  const schema = Joi.object({
    login: Joi.string().min(4).max(14).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "ru"] },
      })
      .required(),
    password: Joi.string().pattern(RegExp("^[a-zA-Z0-9]{6,14}$")).required(),
    height: Joi.string().min(2).max(3),
    weight: Joi.string().min(2).max(3),
    age: Joi.string().min(2).max(3),
    desiredWeight: Joi.string().min(2).max(3),
    bloodGroup: Joi.string().min(1).max(1),
  });
  checkValidation(schema, req, res, next);
};

const userInfoValidation = (req, res, next) => {
  const schema = Joi.object({
    height: Joi.string().min(2).max(3).required(),
    weight: Joi.string().min(2).max(3).required(),
    age: Joi.string().min(2).max(3).required(),
    desiredWeight: Joi.string().min(2).max(3).required(),
    bloodGroup: Joi.string().min(1).max(1).required(),
  });
  checkValidation(schema, req, res, next);
};

const userLoginValidation = (req, res, next) => {
  const schema = Joi.object({
    login: Joi.string().min(4).max(14).required(),
    password: Joi.string().pattern(RegExp("^[a-zA-Z0-9]{6,14}$")).required(),
  });
  checkValidation(schema, req, res, next);
};

const addProductValidation = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    calories: Joi.number().required(),
    weight: Joi.number(),
    date: Joi.string().required(),
  });
  checkValidation(schema, req, res, next);
};

module.exports = {
  userRegistrationValidation,
  userInfoValidation,
  userLoginValidation,
  addProductValidation,
};
