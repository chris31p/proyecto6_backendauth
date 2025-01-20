const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, image, stock } = req.body;
    const newProduct = new Product({ ...req.body, seller: req.user.id });
    await newProduct.save();
    return res.status(201).json({msg:'Producto creado exitosamente'},newProduct);
  } catch (error) {
    return res.status(400).json({msg:'Error, no se pudo crear el producto'}, error);
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({msg:'Productos obtenidos'},products);
  } catch (error) {
    return res.status(400).json({msg:'Hubo un error'}, error);
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    return res.status(200).json({msg:'Producto específico'},product);
  } catch (error) {
    return res.status(400).json({msg:'Hubo un error'}, error);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    return res.status(200).json({msg:'Producto actualizado con éxito'}, product);
  } catch (error) {
    return res.status(400).json({msg:'Hubo un error'}, error);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ msg: "Producto no encontrado" });
    return res.status(200).json({ msg: "Producto eliminado con éxito" });
  } catch (error) {
    return res.status(400).json({msg:'Hubo un error'}, error);
  }
};
