const dateValidation = require('date-and-time');
const {
  searchProducts,
  publicRecommendation,
  privateRecommendation,
  addEatenProducts,
  deleteEatenProducts,
  getEatenProducts,
  addNewProducts
} = require("../services/productsServices");
const { QueryError, ClientError } = require('../helpers/errors')

const searchProductsController = async (req, res) => {
  const owner = req.userId;
  const {
    query,
    page = 1,
    limit = 7,
  } = req.query;
  if (!query) {
    throw new QueryError('Provide a query string')
  }
  const {
    paginatedResponse: productsList,
    AmountOfQueriedProducts: totalProducts,
    AmountOfPages: totalPages
  } = await searchProducts({ query, page, limit, owner });
  res.json({ message: "success", productsList , totalProducts , totalPages});
};

const publicRecommendationController = async (req, res) => {
  const { bloodGroup } = req.query;
  if (Number.isNaN(bloodGroup)) {
    throw new ClientError("Blood group must be a number")
  }
  if (!bloodGroup) {
    throw new ClientError("Provide a blood group")
  }
  const productsNotAllowed = await publicRecommendation(bloodGroup);
  res.json({ message: "success", productsNotAllowed });
};

const privateRecommendationController = async (req, res) => {
  const { userId } = req;
  const { height, weight, age, desiredWeight, bloodGroup } = req.body;
  const recommendation = await privateRecommendation(
    {
      height,
      weight,
      age,
      desiredWeight,
      bloodGroup,
    },
    userId
  );
  res.json({ message: "success", recommendation });
};

const addEatenProductsController = async (req, res) => {
  const owner = req.userId;
  const { title, weight, calories, date } = req.body;
  if (!dateValidation.isValid(date, 'DD.MM.YYYY')) {
     throw new ClientError("Wrong format, expected: DD.MM.YYYY")
  }
  const product = await addEatenProducts({
    title,
    weight,
    calories,
    date,
    owner,
  });
  res.json({ message: "Product successfully saved", product });
};

const deleteEatenProductsController = async (req, res) => {
  const { id: eatenProductId } = req.params;
  const owner = req.userId;
  await deleteEatenProducts({eatenProductId, owner});
  res.json({ message: `Product has been successfully deleted` });
};

const getEatenProductsController = async (req, res) => {
  const owner  = req.userId;
  const { date: dateToFind } = req.query; 
  if (!dateToFind) {
    throw new ClientError("Provide the date")
  }
  if (!dateValidation.isValid(dateToFind, 'DD.MM.YYYY')) {
     throw new ClientError("Wrong format, expected: DD.MM.YYYY")
  }
  const userFoodListByDay = await getEatenProducts({owner, dateToFind});
  res.json({ message: "success", userFoodListByDay});
};

const addNewProductsController = async (req, res) => {
  const owner = req.userId;
  const { title, calories } = req.body;
  const product = await addNewProducts({
    title,
    calories,
    owner
  });
  res.json({ message: "Product successfully saved", product });
};

module.exports = {
  searchProductsController,
  publicRecommendationController,
  privateRecommendationController,
  addEatenProductsController,
  deleteEatenProductsController,
  getEatenProductsController,
  addNewProductsController
};
