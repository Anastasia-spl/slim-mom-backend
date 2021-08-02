const mongoose = require("mongoose");
// mongoose.set('useCreateIndex', true);
const ObjectID = mongoose.Types.ObjectId;
const { Products } = require("../db/productsModel");
const { EatenProducts } = require("../db/eatenProductsModel");
const { User } = require("../db/userModel");

const { QueryError, ClientError } = require("../helpers/errors");

const searchProducts = async ({ query, page, limit }) => { 
  const queriedProducts = await Products.find({ "title.ru": { "$regex": `(.*)${query}(.+)?`, "$options": "i" } }).select({"__v": 0, "_id": 0, "groupBloodNotAllowed": 0});;

  if (queriedProducts.length === 0) {
    throw new QueryError("No product found. Try another title.");
  }
  const AmountOfQueriedProducts = queriedProducts.length;
  const AmountOfPages = AmountOfQueriedProducts < limit ? 1 : Math.ceil(AmountOfQueriedProducts / limit);
  const paginateFrom = (page * limit - limit);
  const paginatedResponse = [...queriedProducts].splice(paginateFrom, limit)
  return { paginatedResponse, AmountOfQueriedProducts, AmountOfPages };
};

const publicRecommendation = async (bloodGroup) => {

  const allProductsList = await Products.find({});
  const productsNotAllowed = allProductsList.reduce((acc, product) => {
    if (product.groupBloodNotAllowed[Number(bloodGroup)]) {
      acc.push(...product.categories);
    }
    const uniqueList = acc.filter(
      (category, index, arr) => arr.indexOf(category) === index
    );
    return uniqueList;
  }, []);
  return productsNotAllowed;
};

const privateRecommendation = async (
  { height, weight, age, desiredWeight, bloodGroup },
  userId
) => {
  await User.findByIdAndUpdate(
     userId,
    { $set:  { height, weight, age, desiredWeight, bloodGroup  } }
  );

  const allProductsList = await Products.find({});

  const productsNotAllowed = allProductsList.reduce((acc, product) => {
    if (product.groupBloodNotAllowed[Number(bloodGroup)]) {
      acc.push(...product.categories);
    }
    const uniqueList = acc.filter(
      (category, index, arr) => arr.indexOf(category) === index
    );
    return uniqueList;
  }, []);

  return { productsNotAllowed };
};

const addEatenProducts = async ({ title, weight, calories, owner, date }) => {
  const user = await EatenProducts.findOne({ owner });
  const _id = new ObjectID();
  if (!user) {
    const newUserProductList = new EatenProducts({
      owner,
      eatenProducts: [{ _id, title, weight, calories, date }],
    });
    await newUserProductList.save();
    return {_id, title, weight, calories, date };
  }
  await EatenProducts.findOneAndUpdate(
    { owner },
    { $push: { eatenProducts: { _id, title, weight, calories, date } } }
  );
  return {_id, title, weight, calories, date };
};

const deleteEatenProducts = async ({ eatenProductId, owner }) => {
  const user = await EatenProducts.findOne({ owner });
  if (!user) {
    throw new ClientError("User have no eaten products")
  }

  const product = user.eatenProducts.find(product => 
    (JSON.stringify(product._id) === JSON.stringify(eatenProductId)))
  if (!product) {
    throw new ClientError("No product with this id")
  }

  await EatenProducts.updateOne(
    { owner },
    { $pull: { eatenProducts: { _id: eatenProductId } } }
  )
};

const getEatenProducts = async ({ owner, dateToFind }) => {
  const user = await EatenProducts.findOne({ owner })
  
  return user ? (user.eatenProducts.filter(({ date }) => date === dateToFind)) : [];
};

module.exports = {
  searchProducts,
  publicRecommendation,
  privateRecommendation,
  addEatenProducts,
  deleteEatenProducts,
  getEatenProducts,
};
