import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../errors/errors.js';
import { Auth, TokenPayload } from '../helpers/auth.js';

// Extendemos el type de Request para poder guardar los datos del usuario:
export interface RequestPlus extends Request {
  info?: TokenPayload;
}

export function logged(req: RequestPlus, resp: Response, next: NextFunction) {
  try {
    // Se coordina con el Front cómo se va a enviar el Token.
    // En este caso, se envía a través de la cabecera con el nombre "Autorization".
    // Entonces ahí hacemos el método get del req para buscarlo:
    const authHeader = req.get('Authorization');

    // Como el Token podría ser undefined, hacemos una guarda:
    if (!authHeader)
      throw new HTTPError(498, 'Invalid Token', 'Not value in auth header');

    // Verificamos que siga el protocolo Bearer.
    // Vemos si el string comienza con ese valor.
    if (!authHeader.startsWith('Bearer'))
      throw new HTTPError(498, 'Invalid Token', 'Not Bearer in auth header');

    // Tomamos el Token haciendo un slice del string sacando la palabra "Bearer" y el espacio que trae después.
    const token = authHeader.slice(7);

    // Verificamos el Token con el método verify del Auth:
    // Si no es correcto, ya habíamos definido que el método verifyJWT arroje un error.
    // Si es correcto devuelve el contenido del Payload (en este caso era email, id y role).
    // Por eso en este caso no hay que hacer un "if" porque si no está correcto y lanza el error, ya es recogido por el Catch.
    const payload = Auth.verifyJWT(token);

    // Guardamos los datos del usuario para poder disponibilizarlo al resto de los middleware posteriores.
    // Lo guardamos en "req" porque queda disponible para todos los middleware posteriores.

    // Creamos la interface nueva de req para poder guardar en info los datos del usuario.
    req.info = payload;

    // Al ser un middleware, una vez terminado el código hay que agregarle un Next para que siga la cadena.
    // Es un Next sin parámetros porque NO es para arrojar error:
    next();
  } catch (error) {
    next(error);
  }
}
