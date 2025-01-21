const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./src/routes/userRoutes');
const productRoutes = require('./src/routes/productRoutes');
const cartRoutes = require('./src/routes/cartRoutes');

dotenv.config();
const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);

//Conexión a MongoDB
mongoose
.connect(process.env.MONGO_URI)
.then(()=> console.log('MongoDB conectado'))
.catch((error)=> console.error(error));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Servidor corriendo en el puerto ${PORT}`));