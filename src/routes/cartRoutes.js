const express = require("express");
const {
  createOrGetCart,
  addProductToCart,
  updateProductQuantity,
  removeProductFromCart,
} = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Obtener o crear carrito
router.get("/get-cart", authMiddleware, createOrGetCart);

// Agregar producto al carrito
router.post("/add-to-cart", authMiddleware, addProductToCart);

// Actualizar cantidad de producto en el carrito
router.put("/update-cart", authMiddleware, updateProductQuantity);

// Eliminar producto del carrito
router.delete("/remove-from-cart", authMiddleware, removeProductFromCart);

module.exports = router;
