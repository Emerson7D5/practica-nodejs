// Importamos nuestro pool de conexiones a la BD
import { pool } from '../db.js';

// Importamos bcryptjs para generar hashes y comparar contraseñas
import bcrypt from 'bcryptjs';

// =========================================
// Obtener todos los usuarios
// =========================================
export const getAllUsers = async () => { 
    // Ejecutamos consulta SQL
    const result = await pool.query('SELECT * FROM doc.usuarios');
    // Devolvemos los resultados
    return result.rows; 
};

// =========================================
// Buscar usuario por email
// =========================================
export const getUserByEmail = async (email) => {  
    // Ejecutamos consulta SQL con parámetro dinámico ($1)
    const result = await pool.query('SELECT * FROM doc.usuarios WHERE email = $1', [email]);
    console.log(result.rows);
    // Retornamos el resultado
    return result.rows; 
};

// =========================================
// Buscar usuario por nombre
// =========================================
export const getByName = async (nombre) => {
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
export const createUser = async (nombre, documento, carnet,email, contrasenia) => { 
    // Número de salt rounds (cost). 10 es un valor razonable para desarrollo.
    const SALT_ROUNDS = 10;

    // Generamos el salt de bcrypt (hash salado internamente)
    // bcrypt.genSaltSync devuelve el salt de forma síncrona
    const salt = bcrypt.genSaltSync(SALT_ROUNDS);

    // Generamos el hash a partir de la contraseña y el salt
    const contraseniaHashed = bcrypt.hashSync(contrasenia, salt); 
    // Definimos la consulta SQL con parámetros
    const query = `INSERT INTO doc.usuarios 
             (nombre, documento, carnet, email, contrasenia, bloqueado, ultimo_login, activo) 
      VALUES ($1, $2, $3, $4, $5, 'N', null, 'A') RETURNING *;`

    // Ejecutamos la consulta de inserción con parámetros seguros
    const result = await pool.query(query, [nombre, documento, carnet, email, contraseniaHashed]);

    // Retornamos el nuevo usuario creado
    return result.rows[0];
 
};

// =========================================
// Actualizar usuario
// =========================================
export const updateUser = async (usuario) => {
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
export const deleteUser = async (id_usuario) => { 
    // Verificamos si el usuario existe
    const usuarioAEliminar = await pool.query('SELECT * FROM doc.usuarios WHERE id_usuario=$1', [id_usuario]);

    // Si no existe, lanzamos un error  
    if (usuarioAEliminar.rowCount === 0) throw new Error('Usuario no encontrado');

    // Si existe, ejecutamos la sentencia DELETE
    const result = await pool.query('DELETE FROM doc.usuarios WHERE id_usuario=$1', [id_usuario]);

    // Confirmamos la eliminación
    return { message: 'Usuario eliminado correctamente', usuario: usuarioAEliminar.rows[0] };     
};


