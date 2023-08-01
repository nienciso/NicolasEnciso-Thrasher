
function obtenerUsuarios (req,res){
  res.send("usuarios");
}

const crearUsuario = (req,res)=>{
  res.send("Usuario creado")
};

const actualizarUsuario = (req,res)=>{
  res.send("Usuario actualizado")
};

const eliminarUsuario = (req,res)=>{
  res.send("Usuario eliminado")
};

//crear el crud
module.exports = {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
};