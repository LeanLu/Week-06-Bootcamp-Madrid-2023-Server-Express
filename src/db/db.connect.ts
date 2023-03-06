// Fichero que va a conectarnos con la base de datos:

// Importamos el mongoose:
import mongoose from 'mongoose';

// Importamos las variables desde el file config:
import { config } from '../config.js';

// Desestructuramos el Object config para tomar las variables más fácilmente:
const { user, password, cluster, dbName } = config;

// Creamos una función que sea capaz de conectarse con la base de datos:
// Devuelve una promise de mongus (de conexión):
export const dbConnect = (env?: string) => {
  // Generamos una variable para que si tiene un valor u otro, esté en contexto de testing o no.
  // De esta manera podemos realizar el super test luego.
  const finalEnv = env || process.env.NODE_ENV;
  const finalDBName = finalEnv === 'test' ? dbName + '_Testing' : dbName;

  // Guardamos la URL del Atlas como un template string:
  const uri = `mongodb+srv://${user}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority`;

  return mongoose.connect(uri);
};
