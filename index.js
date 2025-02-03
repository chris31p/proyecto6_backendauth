const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./src/routes/userRoutes");
const productRoutes = require("./src/routes/productRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const swaggerDocs = require("./src/config/swaggerConfig");
const path = require("path");

dotenv.config();
const app = express();

// Redirigir la raíz a la documentación
app.get('/', (req, res) => {
  res.redirect('/api-docs');
}); 

// Middlewares
app.use(cors());
app.use(express.json());

// Sirve los archivos de Swagger UI desde node_modules
app.use('/swagger-ui', express.static(path.join(__dirname, 'node_modules', 'swagger-ui-dist')));

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);

// Documentación de Swagger
swaggerDocs(app);

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch((error) => console.error(error));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

