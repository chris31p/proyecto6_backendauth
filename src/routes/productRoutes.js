const express = require('express');
const { createProduct, getAllProducts, getProduct, deleteProduct, updateProduct } = require('../controllers/productController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, createProduct);
router.get('/readall', getAllProducts);
router.get('/readone/:id', getProduct);
router.post('/update/:id', authMiddleware , updateProduct);
router.delete('/delete/:id',authMiddleware , deleteProduct);

module.exports = router;