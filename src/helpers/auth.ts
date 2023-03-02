// Hacemos la importación del JWT:
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import bcrypt from 'bcryptjs';
import { HTTPError } from '../errors/errors.js';

// Definimos la interface del payload:
// Lo hacemos extends del payyload de jwt:
export interface TokenPayload extends jwt.JwtPayload {
  id: string;
  email: string;
  role: string;
}

const salt = 10;

// Creamos la class Auth con los métodos.
export class Auth {
  // Creamos los métodos estáticos:

  // Creación de JWT:
  // Para el payload, como es un object con propiedades, hay que definir un Type o Interface.
  static createJWT(payload: TokenPayload) {
    // Método para crear el token.
    // El payload (1er parámetro) se lo tenemos que pasar desde afuera.
    // El secret (2do parámetro) lo sacamos del .env.

    // Podríamos hacer una guarda de tipos para que el Secret no sea undefined.
    // if (!config.jwtSecret) return;

    // Pero en este caso, hacemos una aserción de tipos porque estamos seguros por el funcionamiento de la app que ese secret va a venir siempre.
    return jwt.sign(payload, config.jwtSecret as string);
  }

  // Para verificación del token:
  static verifyJWT(token: string): TokenPayload {
    // Necesita como parámetro el token y el Secret.
    const result = jwt.verify(token, config.jwtSecret as string);

    // El verify devuelve un string si es un error o un payload si está Ok.
    // Entonces hacemos la verificación para lanzar un error:
    if (typeof result === 'string')
      throw new HTTPError(498, 'Invalid Token', result);

    // Si no pasa por la línea anterior, es que esta OK y devolvemos el payload.
    return result as TokenPayload;
  }

  // Este método de encriptación es async.
  // Lo tenemos que colocar cuando lo llamemos.
  static hash(value: string) {
    return bcrypt.hash(value, salt);
  }

  // Le damos el value (password sin hash).
  // Luego el valor encryptado.
  // Y utilizamos el método que hace una comparación para ver si se cumple o no.
  static compare(value: string, hash: string) {
    return bcrypt.compare(value, hash);
  }
}
