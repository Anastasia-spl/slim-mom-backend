const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema({
  active: {
    type: Boolean,
    default: true,
  },
  code: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Verification = mongoose.model("Verification", verificationSchema);

module.exports = {
  Verification,
};
