const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       required:
 *         - user
 *         - products
 *       properties:
 *         id:
 *           type: string
 *           description: ID autogenerado del carrito
 *         user:
 *           type: string
 *           description: ID del usuario
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *                 description: ID del producto
 *               quantity:
 *                 type: number
 *                 description: Cantidad del producto
 *       example:
 *         id: d5fE_asz
 *         user: 60d0fe4f5311236168a109ca
 *         products:
 *           - product: 60d0fe4f5311236168a109cb
 *             quantity: 2
 */

/**
 * @swagger
 * tags:
 *   name: Carts
 *   description: Endpoints para la gestión del carrito de compras
 */

/**
 * @swagger
 * /api/carts/get-cart:
 *   get:
 *     summary: Obtiene el carrito del usuario
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrito creado u obtenido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       403:
 *         description: Acceso denegado. Solo los compradores pueden acceder al carrito.
 *       500:
 *         description: Error al obtener carrito
 */
exports.createOrGetCart = async (req, res) => {
  try {
    if (req.user.role !== 'comprador') {
      console.log("Rol del usuario:", req.user.role);

      return res.status(403).json({ msg: 'Acceso denegado. Solo los compradores pueden acceder al carrito.' });
    }
    const cart = await Cart.findOne({ user: req.user.id }).populate('products.product');
    console.log("ID del usuario:", req.user.id);

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, products: [] });
    }

    return res.status(200).json({msg: 'Carrito obtenido o creado exitosamente',cart});
  } catch (error) {
    return res.status(500).json({msg: 'Hubo un error o no existe'});
  }
};

/**
 * @swagger
 * /api/carts/add-to-cart:
 *   post:
 *     summary: Agrega productos al carrito
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                       description: ID del producto
 *                     quantity:
 *                       type: number
 *                       description: Cantidad del producto
 *     responses:
 *       200:
 *         description: Productos agregados con éxito
 *       404:
 *         description: Uno o más productos no encontrados
 *       500:
 *         description: Hubo un error al agregar productos
 */
exports.addProductToCart = async (req, res) => {
  const { products } = req.body;
  
  try {
    // Verificar si el usuario tiene el rol de comprador
    if (req.user.role !== 'comprador') {
      return res.status(403).json({ msg: 'Acceso denegado. Solo los compradores pueden agregar productos al carrito.' });
    }
    // Validamos si cada producto existe
    const productIds = products.map(p => p.product);
    const foundProducts = await Product.find({ _id: { $in: productIds } });

    if (foundProducts.length !== productIds.length) {
      return res.status(404).json({ msg: 'Uno o más productos no encontrados' });
    }

    // Buscamos el carrito del usuario
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, products: [] });
    }

    // Agregamos los productos al carrito
    products.forEach(({ product, quantity }) => {
      const existingProductIndex = cart.products.findIndex(
        (item) => item.product.toString() === product
      );

      if (existingProductIndex > -1) {
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        cart.products.push({ product, quantity });
      }
    });

    await cart.save();
    return res.status(200).json({ msg: 'Productos agregados con éxito', cart });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Hubo un error al agregar productos' });
  }
};


/**
 * @swagger
 * /api/carts/update-cart:
 *   put:
 *     summary: Modifica la cantidad de un producto en el carrito
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID del producto
 *               quantity:
 *                 type: number
 *                 description: Nueva cantidad del producto
 *     responses:
 *       200:
 *         description: Producto actualizado en el carrito
 *       404:
 *         description: Carrito o producto no encontrado
 *       500:
 *         description: Hubo un error
 */
exports.updateProductQuantity = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    if (req.user.role !== 'comprador') {
      return res.status(403).json({ msg: 'Acceso denegado. Solo los compradores pueden modificar el carrito.' });
    }

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
      return res.status(200).json({msg: 'Carrito modificado exitosamente', cart});
    } else {
      return res.status(404).json({ msg: 'Producto no encontrado en el carrito'});
    }
  } catch (error) {
    res.status(500).json({msg: 'Hubo un error'});
  }
};

/**
 * @swagger
 * /api/carts/remove-from-cart:
 *   delete:
 *     summary: Elimina un producto del carrito de compras del usuario autenticado
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID del producto a eliminar
 *             example:
 *               productId: 60d0fe4f5311236168a109cb
 *     responses:
 *       200:
 *         description: Producto eliminado con éxito
 *       404:
 *         description: Carrito o producto no encontrado
 *       500:
 *         description: Hubo un error
 */
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
    return res.status(200).json({msg: 'Eliminado con éxito', cart});
  } catch (error) {
    res.status(500).json({msg: 'Hubo un error'});
  }
};
