const express = require("express");
const router = express.Router();

const { asyncWrapper } = require("../helpers/apiHelpers");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { userInfoValidation, addProductValidation } = require("../middlewares/validation")

const {
  searchProductsController,
  publicRecommendationController,
  privateRecommendationController,
  addEatenProductsController,
  deleteEatenProductsController,
  getEatenProductsController,
} = require("../controllers/productsController");

router.get("/recommendation", asyncWrapper(publicRecommendationController));

router.use(authMiddleware);
router.get("/search", asyncWrapper(searchProductsController));
router.post("/recommendation", userInfoValidation, asyncWrapper(privateRecommendationController));
router.post("/add",addProductValidation , asyncWrapper(addEatenProductsController));
router.delete("/delete/:id", asyncWrapper(deleteEatenProductsController));
router.post("/eaten", asyncWrapper(getEatenProductsController));

module.exports = { productsRouter: router };
