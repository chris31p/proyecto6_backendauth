const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, image, stock } = req.body;
    console.log("Usuario autenticado: ", req.user)
    if(!req.user || !req.user.id){
      return res.status(401).json({msg: "Usuario no autenticado"})
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
    return res.status(201).json({ msg: "Producto creado exitosamente", product: newProduct });
  } catch (error) {
    return res.status(500).json({ msg: "Error, no se pudo crear el producto", error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({ msg: "Productos obtenidos", products });
  } catch (error) {
    return res.status(500).json({ msg: "Hubo un error", error: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Producto no encontrado" });
    return res.status(200).json({ msg: "Producto específico", product });
  } catch (error) {
    return res.status(500).json({ msg: "Hubo un error", error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).json({ msg: "Producto no encontrado" });
    return res.status(200).json({ msg: "Producto actualizado con éxito", product });
  } catch (error) {
    return res.status(500).json({ msg: "Hubo un error", error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ msg: "Producto no encontrado" });
    return res.status(200).json({ msg: "Producto eliminado con éxito" });
  } catch (error) {
    return res.status(500).json({ msg: "Hubo un error", error: error.message });
  }
};

