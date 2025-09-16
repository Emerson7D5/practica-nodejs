// Importamos nuestro pool de conexiones a la BD
import { pool } from '../db.js';

// =========================================
// Obtener todos los usuarios
// =========================================
export const getAllUsers = async (req, res) => {
  try {
    // Ejecutamos consulta SQL
    const result = await pool.query('SELECT * FROM doc.usuarios');
    // Devolvemos los resultados en formato JSON
    res.json(result.rows);
  } catch (err) {
    // Si ocurre un error, devolvemos el mensaje de error
    res.status(500).json({ error: err.message });
  }
};

// =========================================
// Buscar usuario por email
// =========================================
export const getUserByEmail = async (req, res) => {
  // Extraemos el email de los parámetros de la URL
  const { email } = req.params;
  try {
    // Ejecutamos consulta SQL con parámetro dinámico ($1)
    const result = await pool.query('SELECT * FROM doc.usuarios WHERE email = $1', [email]);
    // Retornamos el resultado
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =========================================
// Buscar usuario por nombre
// =========================================
export const getBuscarNombre = async (nombre) => {
    // Construimos el patrón de búsqueda con porcentajes para el LIKE
    const buscar = `%${nombre}%`
    // Ejecutamos consulta SQL con parámetro dinámico ($1)
    const result = await pool.query(
        "SELECT * FROM doc.usuarios where nombre like $1",[buscar]
    );
    // Retornamos el resultado
    return result.rows;
};

// =========================================
// Crear un nuevo usuario
// =========================================
export const postCrearUsuario = async (nombre, documento, carnet,email, contrasenia) => {
  try {
    // Definimos la consulta SQL con parámetros
    const query = `INSERT INTO doc.usuarios 
             (nombre, documento, carnet, email, contrasenia, bloqueado, ultimo_login, activo) 
      VALUES ($1, $2, $3, $4, $5, 'N', null, 'A') RETURNING *;`

    // Ejecutamos la consulta de inserción con parámetros seguros
    const result = await pool.query(query, [nombre, documento, carnet, email, contrasenia]);

    // Retornamos el nuevo usuario creado
    return result.rows[0];

  } catch (err) {
    // Si ocurre error, lo lanzamos para que lo capture el controlador
    throw err;
  }
};

// =========================================
// Actualizar usuario
// =========================================
export const actualizarUsuario = async (usuario) => {
  // Definimos la consulta SQL con parámetros
  const query = `UPDATE doc.usuarios 
                SET nombre=$1, 
                    documento=$2,
                    carnet=$3,
                    email=$4,
                    contrasenia=$5
                WHERE id_usuario=$6
                RETURNING *;`;
 
    // Ejecutamos la actualización
    const result = await pool.query(query, usuario);

    // Si no encontró usuario con ese ID
    if (result.rowCount === 0) throw new Error('Usuario no encontrado');

    // Retornamos el usuario actualizado
    return result.rows[0]; 
};

// =========================================
// Eliminar usuario
// =========================================
export const eliminarUsuario = async (id_usuario) => {
  try {
    // Verificamos si el usuario existe
    const usuarioAEliminar = await pool.query('SELECT * FROM doc.usuarios WHERE id_usuario=$1', [id_usuario]);

    // Si no existe, lanzamos un error
    if (usuarioAEliminar.rowCount === 0) throw new Error('Usuario no encontrado');

    // Si existe, ejecutamos la sentencia DELETE
    const result = await pool.query('DELETE FROM doc.usuarios WHERE id_usuario=$1', [id_usuario]);

    // Confirmamos la eliminación
    return { message: 'Usuario eliminado correctamente', usuario: usuarioAEliminar.rows[0] };    
  } catch (err) {
    return { error: err.message };
  }
};


