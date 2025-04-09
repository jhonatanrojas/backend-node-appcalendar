const { response } = require("express");
const { generarJWT } = require("../helpers/jwt");
const User = require("../models/UserModel");
const bcryptjs = require("bcryptjs");

const crearUsuario = async (req, res = response) => {
  try {
    const {  email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario ya existe",
      });
    }

    //Crear usuario
    const user = new User(req.body);

    //Encriptar contraseña
    const salt = bcryptjs.genSaltSync(10);
    user.password = bcryptjs.hashSync(password, salt);

  

    await user.save();
    //Generar JWT
    const token = await generarJWT(user.id, user.name);

    res.status(201).json({
      ok: true,
      uid:user.id,
      name:user.name,
      token
    });


  } catch (error) {

    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "error al crear usuario",
    });
  }
};

const renewToken = async(req, res = response) => {

  const uid = req.uid;
  const name = req.name;

  const token = await generarJWT(uid, name);


  res.json({
    ok: true,
    uid,
    name,
    token,

    msg: "Renew Token",
  });
};

const login = async(req, res = response) => {
  const { email, password } = req.body;

try {
  
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      ok: false,
      msg: "El correo no existe",
    });
  }

  //Confirmar contraseña
  const validPassword = bcryptjs.compareSync(password, user.password);
  if (!validPassword) {
    return res.status(400).json({
      ok: false,
      msg: "La contraseña no es correcta",
    });
  }

//Generar JWT
const token = await generarJWT(user.id, user.name);

  res.json({
    ok: true,
    uid:user.id,  
    name:user.name,  
    token
  });

} catch (error) {
    
  console.log(error);
  res.status(500).json({
    ok: false,
    msg: "error a iniciar sesion",
  });
}
};

module.exports = {
  crearUsuario,
  renewToken,
  login,
};
