const mongoose = require("mongoose")

const personalProductsSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: [true, "Provide user id"],
    unique: true
  },
  productsList: [{
     title: {
      type: String,
      required: [true, "Set title for product"]
    },
    calories: {
      type: Number,
      required: [true, "Indicate calories per 100 grams"]
    },
  }]
});

const PersonalProducts = mongoose.model("PersonalProducts", personalProductsSchema);

module.exports = {
 PersonalProducts
};