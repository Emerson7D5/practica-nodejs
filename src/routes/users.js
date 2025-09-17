// Importamos Router desde express para crear un conjunto de rutas
import { Router } from 'express';

// Importamos los controladores que manejan la lógica de cada ruta
import * as userController from '../controllers/usersController.js';

// Creamos una instancia de Router
const router = Router();

// Ruta para obtener todos los usuarios (GET /users)
router.get('/', userController.getObtenerTodosLosUsuarios); 
 
// Ruta para obtener un usuario por email (GET /users/buscarPorEmail/:email)
router.get('/buscarPorEmail/:email', userController.getObtenerPorEmail);

// Ruta para buscar usuarios por nombre (GET /users/buscarPorNombre/:nombre)
router.get('/buscarPorNombre/:nombre', userController.getBuscarNombre);

// Ruta para crear un nuevo usuario (POST /users)
router.post('/', userController.postCrearUsuario);

// Ruta para actualizar un usuario existente (PUT /users/:id_usuario)
router.put('/:id_usuario', userController.putActualizarUsuario);

// Ruta para eliminar un usuario (DELETE /users/:id_usuario)
router.delete('/:id_usuario', userController.deleteEliminarUsuario);

// Exportamos el router para usarlo en index.js
export default router;
