const express = require("express");

const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  adjustStock,
  getLowStock,
  categorySummary
} = require(
  "../controllers/productController"
);

router.route("/")
  .post(createProduct)
  .get(getProducts);

router.get(
  "/low-stock",
  getLowStock
);

router.get(
  "/summary",
  categorySummary
);

router.route("/:id")
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

router.patch(
  "/:id/stock",
  adjustStock
);

module.exports = router;