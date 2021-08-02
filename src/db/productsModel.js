const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  title: {
    ru: {
      type: String,
      text: true
    },
    ua: {
      type: String,
      text: true
    }
  },
  calories: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  groupBloodNotAllowed: {
    type: Array
  },
  categories: {
    type: Array
  }
});

const Products = mongoose.model("Products", productsSchema);

module.exports = {
  Products
};
