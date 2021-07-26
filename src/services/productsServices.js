const { Products } = require('../db/productsModel')
const { EatenProducts } = require('../db/eatenProductsModel')

const {
  QueryError
} = require('../helpers/errors')

const searchProducts = async (query) => {
  const allProductsList = await Products.find({})
  const templatedQuery = query.trim().toLowerCase().split(" ")
  const queriedProducts = allProductsList.filter(product => {
    const templatedTitle = product.title.ru.toLowerCase().split(" ")
    let coincidences = true
    for(const queryWord of templatedQuery) {
      if (!templatedTitle.includes(queryWord)) {
        coincidences = false
      }
    }
    return coincidences 
  })

  if (queriedProducts.length === 0) {
   throw new QueryError('No product found. Try another title.')
 }
  return queriedProducts
}

const publicRecommendation = async ({
  height, weight, age, desiredWeight, bloodGroup
}) => {
  const recommendedCaloriesPerDay = 10 * weight + 6.25 * height - 5 * age - 161 - 10 * (weight - desiredWeight)
  
  const allProductsList = await Products.find({})
  const productsNotAllowed = allProductsList.reduce((acc, product) => {
      if (product.groupBloodNotAllowed[Number(bloodGroup)]) {
        acc.push(product.categories.join(", "))
      }
    const uniqueList = acc.filter((category, index, arr) =>
      arr.indexOf(category) === index)
    return uniqueList
    }, [])
  return { recommendedCaloriesPerDay, productsNotAllowed }
}

const privateRecommendation = async () => {

}

const postEatenProducts = async ({ title, weight, calories }) => {
  const newProduct = new EatenProducts({title, weight, calories })
  await newProduct.save()
  return newProduct
}

const deleteEatenProducts = async () => {

}

const getEatenProducts = async () => {

}

module.exports = {
  searchProducts,
  publicRecommendation,
  privateRecommendation,
  postEatenProducts,
  deleteEatenProducts,
  getEatenProducts
}