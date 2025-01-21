const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const newUser = new User({ name, email, password, role });
    await newUser.save();
    return res.status(201).json({ msg: "Usuario registrado exitosamente!" });
  } catch (error) {
    return res.status(400).json("Error al registrar el usuario", error);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ msg: "Credenciales inválidad" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "120",
      }
    );
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(400).json({ msg: "Hubo un error" }, error);
  }
};

exports.updateUser = async(req, res)=>{
    try {
       const user = await User.findByIdAndUpdate(req.params.id, req.body, {
             new: true,
           });
           if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
           return res.status(200).json({msg:'Usuario actualizado con éxito'}, user); 
    } catch (error) {
        return res.status(400).json({msg:'Hubo un error'}, error);
    }
}

exports.verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ userId: decoded.id, role: decoded.role });
  } catch (error) {
    res.status(401).json({ message: "Token inválido o ya expiró" });
  }
};
