const express = require('express');
const { createProduct, getAllProducts, getProduct, deleteProduct, updateProduct } = require('../controllers/productController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/crear-producto', authMiddleware, createProduct);
router.get('/obtener-productos', getAllProducts);
router.get('/ver-producto/:id', getProduct);
router.put('/actualizar-producto/:id', authMiddleware , updateProduct);
router.delete('/eliminar-producto/:id',authMiddleware , deleteProduct);

module.exports = router;