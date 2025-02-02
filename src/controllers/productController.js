const Product = require("../models/Product");

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - image
 *         - stock
 *         - seller
 *       properties:
 *         id:
 *           type: string
 *           description: ID autogenerado del producto
 *         name:
 *           type: string
 *           description: Nombre del producto
 *         description:
 *           type: string
 *           description: Descripción del producto
 *         price:
 *           type: number
 *           description: Precio del producto
 *         image:
 *           type: string
 *           description: URL de la imagen del producto
 *         stock:
 *           type: number
 *           description: Cantidad en stock del producto
 *         seller:
 *           type: string
 *           description: ID del vendedor
 *       example:
 *         id: d5fE_asz
 *         name: Producto Ejemplo
 *         description: Este es un producto de ejemplo
 *         price: 100
 *         image: http://example.com/image.jpg
 *         stock: 10
 *         seller: 60d0fe4f5311236168a109ca
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Endpoints para la gestión de productos
 */

/**
 * @swagger
 * /api/products/crear-producto:
 *   post:
 *     summary: Crea un nuevo producto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       401:
 *         description: Usuario no autenticado
 *       500:
 *         description: Error, no se pudo crear el producto
 */
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, image, stock } = req.body;
    console.log("Usuario autenticado: ", req.user);
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Usuario no autenticado" });
    }
    const newProduct = new Product({
      name,
      description,
      price,
      image,
      stock,
      seller: req.user.id,
    });
    await newProduct.save();
    return res
      .status(201)
      .json({ msg: "Producto creado exitosamente", product: newProduct });
  } catch (error) {
    return res
      .status(500)
      .json({
        msg: "Error, no se pudo crear el producto",
        error: error.message,
      });
  }
};

/**
 * @swagger
 * /api/products/obtener-productos:
 *   get:
 *     summary: Obtiene todos los productos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Productos obtenidos
 *       500:
 *         description: Error al obtener productos
 */
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({ msg: "Productos obtenidos", products });
  } catch (error) {
    return res.status(500).json({ msg: "Hubo un error", error: error.message });
  }
};

/**
 * @swagger
 * /api/products/ver-producto/{id}:
 *   get:
 *     summary: Obtiene un producto específico por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Hubo un error
 */
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ msg: "Producto no encontrado" });
    return res.status(200).json({ msg: "Producto específico", product });
  } catch (error) {
    return res.status(500).json({ msg: "Hubo un error", error: error.message });
  }
};

/**
 * @swagger
 * /api/products/actualizar-producto/{id}:
 *   put:
 *     summary: Actualiza un producto por el ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del producto
 *               description:
 *                 type: string
 *                 description: Descripción del producto
 *               price:
 *                 type: number
 *                 description: Precio del producto
 *               image:
 *                 type: string
 *                 description: URL de la imagen del producto
 *               stock:
 *                 type: number
 *                 description: Cantidad en stock del producto
 *               seller:
 *                 type: string
 *                 description: ID del vendedor
 *             example:
 *               name: Aspire Intel 3
 *               description: Este es un computador para todo uso y para toda la familia
 *               price: 699
 *               image: https://polipapel.vteximg.com.br/arquivos/ids/179968-1000-1000/D06768.png?v=638427597334930000
 *               stock: 24
 *               seller: 6793f394f217c2d7434f28c5
 *     responses:
 *       200:
 *         description: Producto actualizado con éxito
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Hubo un error
 */
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    } else {
      return res.status(200).json({ msg: "Producto actualizado con éxito", product });
    }    
  } catch (error) {
    return res.status(500).json({ msg: "Hubo un error", error: error.message });
  }
};

/**
 * @swagger
 * /api/products/eliminar-producto/{id}:
 *   delete:
 *     summary: Elimina un producto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado con éxito
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Hubo un error
 */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ msg: "Producto no encontrado" });
    return res.status(200).json({ msg: "Producto eliminado con éxito" });
  } catch (error) {
    return res.status(500).json({ msg: "Hubo un error", error: error.message });
  }
};