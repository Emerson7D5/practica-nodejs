// Importamos el paquete 'pg' que nos permite conectarnos a PostgreSQL
import pkg from 'pg';

// Importamos dotenv para leer las variables de entorno desde el archivo .env
import dotenv from 'dotenv';

// Cargamos las variables de entorno
dotenv.config();

// Extraemos la clase Pool de 'pg', que se encarga de manejar un grupo de conexiones
const { Pool } = pkg;

// // Creamos y exportamos un pool de conexión reutilizable
// export const pool = new Pool({
//   user: process.env.DB_USER,     // Usuario de la BD definido en .env
//   host: process.env.DB_HOST,     // Host del servidor de la BD
//   password: process.env.DB_PASSWORD, // Contraseña de la BD
//   database: process.env.DB_NAME, // Nombre de la BD
//   port: process.env.DB_PORT      // Puerto en el que escucha PostgreSQL
// });
 

export const pool = new Pool({
  host: "gold-mon-mothma.eks1.us-east-1.aws.cratedb.net",
  port: 5432,
  user: "admin",
  password: "_F6KZg)-KZK2(X(r2!.pC!!d",
  ssl: true,
});