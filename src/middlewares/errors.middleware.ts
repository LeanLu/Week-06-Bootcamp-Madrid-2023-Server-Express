import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { CustomError, HTTPError } from '../errors/errors';
import { Error } from 'mongoose';

const debug = createDebug('W6:errorsMiddleware');

export const errorsMiddleware = (
  error: CustomError | Error,
  _req: Request,
  resp: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  debug('Soy el middleware de errores');

  // Definimos la variable status con el 500 y luego comprobamos si es otro tipo de Error:
  let status = 500;
  // Lo mismo para el mensaje:
  let statusMessage = 'Internal server error';

  if (error instanceof HTTPError) {
    status = error.statusCode;
    statusMessage = error.statusMessage;
  }

  // Podríamos verificar si el error fue generado por Mongoose y discriminarlos:
  // Podemos cambiar el error del 500 que teníamos definido por un 400 para indicar que fue un problema del usuario.
  if (error instanceof Error.CastError) {
    status = 400;
    statusMessage = 'Bad formatted data in the request';
  }

  if (error instanceof Error.ValidationError) {
    status = 406;
    statusMessage = 'Validation error in the request';
  }

  // Definimos el Status de la respuesta:
  resp.status(status);

  // Se envía la respuesta como json porque esto lo recibe la consola del usuario.
  // Se envíán las variables definidas arriba.
  resp.json({
    error: [
      {
        status,
        statusMessage,
      },
    ],
  });
  // Luego enviamos la información por consola interna:
  debug(status, statusMessage, error.message);
};
