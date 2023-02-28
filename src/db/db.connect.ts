// Fichero que va a conectarnos con la base de datos:

// Importamos el mongoose:
import mongoose from 'mongoose';

// Importamos las variables desde el file config:
import { config } from '../config.js';

// Desestructuramos el Object config para tomar las variables más fácilmente:
const { user, password, cluster, dbName } = config;

// Creamos una función que sea capaz de conectarse con la base de datos:
// Devuelve una promise de mongus (de conexión):
export const dbConnect = () => {
  // Guardamos la URL del Atlas como un template string:
  const uri = `mongodb+srv://${user}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority`;

  return mongoose.connect(uri);
};
