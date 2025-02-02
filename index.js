const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./src/routes/userRoutes');
const productRoutes = require('./src/routes/productRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const swaggerDocs = require("./src/config/swaggerConfig");

dotenv.config();
const app = express();

swaggerDocs(app);

//Middlewares
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

app.get("/", (req, res) => {
    res.send("API funcionando correctamente en Render 🎉");
  });
  
//Conexión a MongoDB
mongoose
.connect(process.env.MONGO_URI)
.then(()=> console.log('MongoDB conectado'))
.catch((error)=> console.error(error));

const PORT = process.env.PORT || 5000;
console.log(`Iniciando servidor en el puerto: ${PORT}`);
app.listen(PORT, ()=> console.log(`Servidor corriendo en el puerto ${PORT}`));