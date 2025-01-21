const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Crear u obtener el carrito del usuario
exports.createOrGetCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('products.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, products: [] });
    }

    return res.status(200).json({msg: 'Creado exitosamente'},cart);
  } catch (error) {
    return res.status(500).json({msg: 'Hubo un error'}, error);
  }
};

// Agregar producto al carrito
exports.addProductToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, products: [] });
    }

    const existingProductIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingProductIndex > -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    return res.status(200).json({msg: 'Producto agregado con éxito'},cart);
  } catch (error) {
    res.status(500).json({msg: 'Hubo un error'}, error);
  }
};

// Editar la cantidad de un producto en el carrito
exports.updateProductQuantity = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ msg: 'Carrito no encontrado' });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      res.status(200).json({msg: 'Carrito modificado exitosamente'},cart);
    } else {
      res.status(404).json({ msg: 'Producto no encontrado en el carrito' });
    }
  } catch (error) {
    res.status(500).json({msg: 'Hubo un error'}, error);
  }
};

// Eliminar producto del carrito
exports.removeProductFromCart = async (req, res) => {
  const { productId } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ msg: 'Carito no encontrado' });
    }

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    return res.status(200).json({msg: 'Eliminado con éxito'}, cart);
  } catch (error) {
    res.status(500).json({msg: 'Hubo un error'}, error);
  }
};
