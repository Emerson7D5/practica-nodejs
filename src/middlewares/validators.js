// src/middlewares/validators.js

// Importamos las funciones para generar validadores (body, param, etc.)
import { body, validationResult } from 'express-validator';

// Importamos el servicio para poder validar unicidad contra la BD
import * as userService from '../services/usersServices.js';


/* -----------------------
   Helper: runValidations
   -----------------------
   - Recibe un array de validaciones (p. ej. [ body(...), body(...), ... ])
   - Ejecuta cada validación contra la petición
   - Revisa validationResult y, si hay errores, responde 400 con formato uniforme
*/
export const runValidations = (validations) => {
  // Devolvemos un middleware estándar (req, res, next)
  return async (req, res, next) => {
    // Iteramos cada validación y la ejecutamos (run) contra req
    for (const validation of validations) {
      await validation.run(req);
    }

    // Obtenemos el resultado de las validaciones
    const errors = validationResult(req);

    // Si no hay errores, continuamos con el siguiente middleware / controlador
    if (errors.isEmpty()) {
      return next();
    }

    // Si existen errores, respondemos con estado 400 y lista de errores
    return res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
  };
};


/* -------------------------------------
   Validadores para crear usuario (POST)
   -------------------------------------
   - nombre: obligatorio, no vacío, trim()
   - email: obligatorio, formato correcto, y además
            comprobamos en BD que NO exista (validación asíncrona)
   - contrasenia: obligatorio, mínimo 6 caracteres
*/
export const createUserValidators = [
  // Validación para "nombre": quitar espacios al inicio/fin y exigir que no esté vacío
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio'),

  // Validación para "email": trim, formato de email válido
  body('email')
    .trim()
    .isEmail()
    .withMessage('El email no es válido')
    // .bail() hace que si falla la validación anterior no siga con la custom
    .bail()
    // Validación asíncrona: comprobar en BD que el email no exista
    .custom(async (value) => {
      // Llamamos al servicio que busca por email
      const user = await userService.getUserByEmail(value);

      // Si existe un usuario con ese email, rechazamos la validación
      if (user) {
        // Rechazamos con un mensaje; express-validator convertirá esto en un error
        return Promise.reject('El email ya está registrado');
      }

      // Si no existe, resolvemos correctamente
      return true;
    }),

  // Validación para "contrasenia": longitud mínima
  body('contrasenia')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
];


/* -------------------------------------
   Validadores para actualizar usuario (PUT)
   -------------------------------------
   - nombre: opcional, si viene no puede ser vacío
   - email: opcional, si viene debe ser válido y no estar en uso por otro usuario
   Nota: aquí comprobamos que si el email pertenece al mismo usuario que se está editando,
         no lo consideramos conflicto.
*/
export const updateUserValidators = [
  // Nombre opcional, si está debe ser no vacío
  body('nombre')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre no puede estar vacío'),

  // Email opcional, si está debe ser válido...
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('El email no es válido')
    .bail()
    // y validación asíncrona para verificar unicidad (pero permite el mismo email del propio usuario)
    .custom(async (value, { req }) => {
      // Buscamos un usuario con ese email
      const user = await userService.getUserByEmail(value);

      // Si existe user y el id no coincide con el que estamos actualizando => conflicto
      // NOTA: adaptamos conversión de tipos según tu esquema de id (aquí asumimos id numérico)
      if (user && String(user.id_usuario) !== String(req.params.id)) {
        return Promise.reject('El email ya está en uso por otro usuario');
      }

      // Si no hay conflicto, validación OK
      return true;
    })
];
