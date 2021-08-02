const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  login: {
    type: String,
    required: [true, "Set name for user"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Set login for user"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Set password for user"],
  },
  height: {
    type: Number,
    default: null,
  },
  weight: {
    type: Number,
    default: null,
  },
  age: {
    type: Number,
    default: null,
  },
  desiredWeight: {
    type: Number,
    default: null,
  },
  bloodGroup: {
    type: Number,
    default: null,
  },
  productsNotAllowed: {
    type: Array,
    default: null,
  },
  token: {
    type: String,
    default: null,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function () {
  if (this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
