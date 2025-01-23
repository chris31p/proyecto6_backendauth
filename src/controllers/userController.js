const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

exports.loginUser = async (req, res) => {
  
    try {
      const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'El email no existe' });
        }
        const correctPassword = await bcrypt.compare(password, user.password); 
        if (!correctPassword){
            return res.status(400).json({ message: 'El email o la contrasena no corresponden' });
        }

        const payload = { user: {  id: user.id } };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: 120
            },
            (error, token) => {
                if (error) throw error;
                return res.status(200).json({ msg: "Inicio de sesión exitoso", token });
            }
        );



    } catch (error) {
        res.json({
            message: "Hubo un error",
            error
        })
    }
};

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

exports.verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Respuesta exitosa con los datos del usuario
    res.status(200).json({ userId: decoded.id, role: decoded.role });
  } catch (error) {
    // Respuesta en caso de token inválido o expirado
    res.status(401).json({ msg: "Token inválido o ya expiró", error: error.message });
  }
};
