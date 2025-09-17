// ============================================
// Middleware centralizado para manejo de errores
// ============================================ 

// Exportamos una función middleware de 4 parámetros (obligatorio en Express)
export const errorHandler = (err, req, res, next) => {
  // Mostramos el error en consola para depurar al momento de programar
  console.error(err);

  // Si el error tiene un status definido, lo usamos. Si no, asumimos 500 (server error)
  const statusCode = err.statusCode || 500;

  // Si el error tiene un mensaje definido, lo usamos. Si no, mensaje genérico
  const message = err.message || 'Error interno del servidor';

  // Respondemos con un JSON uniforme
  res.status(statusCode).json({
    status: 'error',
    message
  });
};
