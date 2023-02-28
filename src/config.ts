// Hacemos la extracción de las variables del .env para luego disponibilizarlas para el resto.

// Primero hacemos la importación del dotenv:
import dotenv from 'dotenv';

// Hacemos la configuración para tomar las variables:
dotenv.config();

// Tomamos las variables que hayamos definido:
// Se puede crear un Array o exportar una por una o exportarlas en un Object:
export const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  cluster: process.env.DB_CLUSTER,
  dbName: process.env.DB_NAME,
};
