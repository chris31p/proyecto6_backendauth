const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//Documentamos con Swagger

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: ID autogenerado del usuario
 *         name:
 *           type: string
 *           description: Nombre del usuario
 *         email:
 *           type: string
 *           description: Correo electrónico del usuario
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 *         role:
 *           type: string
 *           description: Rol del usuario (comprador o vendedor)
 *       example:
 *         id: d5fE_asz
 *         name: Juan Perez
 *         email: juan.perez@example.com
 *         password: password123
 *         role: comprador
 */

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para gestionar usuarios
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error al registrar el usuario
 */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPass = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const newUser = new User({ name, email, password: hashedPass, role });
    await newUser.save();

    // Respuesta exitosa
    return res.status(201).json({ msg: "Usuario registrado exitosamente!" });
  } catch (error) {
    // Respuesta en caso de error
    return res
      .status(400)
      .json({ msg: "Error al registrar el usuario", error: error.message });
  }
};


/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Inicia sesión de usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *             example:
 *               email: juan.perez@example.com
 *               password: password123
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso, devuelve token
 *       401:
 *         description: El email o la contraseña no corresponden
 *       500:
 *         description: Hubo un error en el servidor
 */
exports.loginUser = async (req, res) => {
  
    try {
      const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'El email no existe' });
        }

        const correctPassword = await bcrypt.compare(password, user.password); 
        if (!correctPassword){
            return res.status(401).json({ message: 'El email o la contrasena no corresponden' });
        }

        const payload = { id: user.id, role: user.role, name: user.name };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            });
            return res.status(200).json({msg:"Inicio de sesión exitoso", token})

    } catch (error) {
        return res.status(500).json({
            message: "Hubo un error en el servidor",
            error
        })
    }
};

/**
 * @swagger
 * /api/users/update/{id}:
 *   put:
 *     summary: Actualiza la información de un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito
 *       404:
 *         description: Usuario no encontrado
 *       400:
 *         description: Error en la actualización
 */
exports.updateUser = async (req, res) => {
  try {
    // Actualizar usuario por ID
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Devuelve el documento actualizado
    });

    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // Respuesta exitosa
    return res.status(200).json({ msg: "Usuario actualizado con éxito", user });
  } catch (error) {
    // Respuesta en caso de error
    return res
      .status(400)
      .json({ msg: "Hubo un error", error: error.message });
  }
};

/**
 * @swagger
 * /api/users/verifytoken:
 *   get:
 *     summary: Verifica el token de autenticación
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido, devuelve información del usuario
 *       401:
 *         description: Token inválido o expirado
 */
exports.verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "Token no proporcionado" });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Respuesta exitosa con los datos del usuario
    return res.status(200).json({ userId: decoded.id, role: decoded.role, name:decoded.name});
  } catch (error) {
    // Respuesta en caso de token inválido o expirado
    return res.status(401).json({ msg: "Token inválido o ya expiró", error: error.message });
  }
};
