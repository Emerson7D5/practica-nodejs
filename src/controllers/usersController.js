
// Importamos los métodos que definimos en services/usersServices.js
import * as userService from '../services/usersServices.js';

export const getObtenerTodosLosUsuarios = async (req, res, next) => {
  try {
    // Ejecutamos consulta SQL
    const result = await userService.getAllUsers();
    // Devolvemos los resultados en formato JSON
    res.json(result);
  } catch (err) {
    // En caso de error, lo pasamos al middleware de manejo de errores
    return next(err);
  }
};

export const getObtenerPorEmail = async (req, res, next) => {
  // Extraemos el email de los parámetros de la URL
  const { email } = req.params;
  try {
    // Ejecutamos consulta SQL con parámetro dinámico ($1)
    const result = await userService.getUserByEmail(email);
    // Retornamos el resultado
    res.json(result);
  } catch (err) {
    return next(err);
  }
};

export const getBuscarNombre = async (req, res, next) => {
    try {
        // Extraemos el nombre de los parámetros de la URL
        const { nombre } = req.params;
        // Ejecutamos consulta SQL con parámetro dinámico ($1)
        const result = await userService.getByName(nombre);
        // Retornamos el resultado
        res.json(result);
    } catch (err) {
        return next(err);
    }
};   

export const postCrearUsuario = async (req, res, next) => {
  try {
    // Extraemos los datos enviados en el body
    const { nombre, documento, carnet, email, contrasenia } = req.body;

    // Llamamos al servicio que maneja la inserción en la BD
    const newUser = await userService.createUser(nombre, documento, carnet, email, contrasenia);

    // Respondemos con el usuario recién creado
    res.status(201).json(newUser);

  } catch (err) { 
    return next(err);
  }
};

export const putActualizarUsuario = async (req, res, next) => {
  try {
    // Extraemos los datos enviados en el body
    const { nombre, documento, carnet, email, contrasenia } = req.body;

    // Extraemos el id_usuario de los parámetros de la URL
    const { id_usuario } = req.params;

    // Creamos un arreglo con los datos del usuario a actualizar
    const usuario = [nombre, documento, carnet, email, contrasenia, id_usuario];

    // Llamamos al servicio que maneja la actualización en la BD
    const updatedUser = await userService.updateUser(usuario);

    // Respondemos con el usuario actualizado
    res.status(201).json(updatedUser);

  } catch (err) { 
    return next(err);
  }
};

export const deleteEliminarUsuario = async (req, res, next) => {
  try {
    // Extraemos el id_usuario de los parámetros de la URL
    const { id_usuario } = req.params;

    // Llamamos al servicio que maneja la eliminación en la BD
    const result = await userService.deleteUser(id_usuario);

    // Respondemos con el resultado de la eliminación
    res.status(200).json(result);
  } catch (err) { 
    return next(err);
  }
};