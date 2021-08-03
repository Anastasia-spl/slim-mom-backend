const express = require("express");
const router = express.Router();

const { asyncWrapper } = require("../helpers/apiHelpers");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { userInfoValidation, addProductValidation , addNewProductValidation} = require("../middlewares/validation")

const {
  searchProductsController,
  publicRecommendationController,
  privateRecommendationController,
  addEatenProductsController,
  deleteEatenProductsController,
  getEatenProductsController,
  addNewProductsController,
} = require("../controllers/productsController");

router.get("/recommendation", asyncWrapper(publicRecommendationController));

router.use(authMiddleware);
router.get("/search", asyncWrapper(searchProductsController));
router.post("/recommendation", userInfoValidation, asyncWrapper(privateRecommendationController));
router.post("/",addProductValidation , asyncWrapper(addEatenProductsController));
router.delete("/:id", asyncWrapper(deleteEatenProductsController));
router.get("/eaten", asyncWrapper(getEatenProductsController));
router.post("/personal/add", addNewProductValidation, asyncWrapper(addNewProductsController));

module.exports = { productsRouter: router };
