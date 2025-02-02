const express = require("express");
const {
  createOrGetCart,
  addProductToCart,
  updateProductQuantity,
  removeProductFromCart,
} = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/get-cart", authMiddleware, createOrGetCart);
router.post("/add-to-cart", authMiddleware, addProductToCart);
router.put("/update-cart", authMiddleware, updateProductQuantity);
router.delete("/remove-from-cart", authMiddleware, removeProductFromCart);

module.exports = router;
