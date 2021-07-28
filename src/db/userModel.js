const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Set name for user"],
  },
  login: {
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
  },
  weight: {
    type: Number,
  },
  age: {
    type: Number,
  },
  desiredWeight: {
    type: Number,
  },
  bloodGroup: {
    type: Number,
  },
  token: {
    type: String,
    default: null,
  },
});

userSchema.pre("save", async function () {
  if (this.isNew) {
    this.password = bcrypt.hash(this.password, 10);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
