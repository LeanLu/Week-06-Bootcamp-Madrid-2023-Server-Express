import { UserStructure } from '../entities/user.model';
import { Repo } from '../repository/repo.interface';
import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../errors/errors.js';
import { Auth, TokenPayload } from '../helpers/auth.js';

const debug = createDebug('W6:users.controller');

export class UsersController {
  constructor(public repo: Repo<UserStructure>) {
    this.repo = repo;
    debug('Controller instanced');
  }

  // Tendría que hacer la operación básica de Login y Register:

  // Tomamos el Post que había antes y lo llamamos register:
  async register(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('register:post method');

      // Primero hay que verificar que en el req.body haya un email y password.
      if (!req.body.email || !req.body.password)
        throw new HTTPError(401, 'Unauthorized', 'Invalid email o password');

      // Luego, antes de enviar los datos al repo, hacemos la encryptación de la password:
      // Hay que colocar un await para que se resuelva la encryptación:
      req.body.password = await Auth.hash(req.body.password);

      // Luego creamos el usuario.
      const data = await this.repo.create(req.body);

      // Devolvemos los datos del usuario.
      // Pero le quitamos la password con el "delete" del repo model que definimos.
      // Agregamos el Status 201 que es el correcto para registro:
      resp.status(201);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, resp: Response, next: NextFunction) {
    // Llegan los datos del usuario en el body.
    // Buscar al usuario en la base de datos. A través de un “search”.
    // En este caso hay que hacer un "search" by email (que es el dato que definimos en la entity)
    // Verificar si existe. Si existe, hay que crear el token.
    // Enviar el token al usuario con "send".
    // Si no existe, envío un aviso error.

    // Creamos el método "search" en el repo.

    try {
      debug('login:post method');

      // Dentro del body deberíamos tener un email. Pero primero lo verificamos:
      // Sino arrojamos HTError. El 3er parámetro es para la consola así que puede ir con más detalle.

      if (!req.body.email || !req.body.password)
        throw new HTTPError(401, 'Unauthorized', 'Invalid email o password');

      const data = await this.repo.search({
        key: 'email',
        value: req.body.email,
      });

      // Verificamos que haya encontrado un Array con data.
      // Si el Array está vacío es porque no se encontró.
      if (!data.length)
        throw new HTTPError(401, 'Unauthorized', 'Email not found');

      // Si existe el Array es porque encontró el usuario.
      // Entonces ese Array debería tener una sola posición con ese único usuario. Sería data[0]
      // Luego hay que verificar que tenemos la contraseña:
      // Hacemos la comparación de la password del body con la guardada en la base de datos:
      if (!(await Auth.compare(req.body.password, data[0].password)))
        throw new HTTPError(401, 'Unauthorized', 'Password not match');

      // Si está todo Ok hay que crear el token:

      // Definimos primero el Payload para coloarlo en el método para crear el Token:
      const payload: TokenPayload = {
        email: data[0].email,
        role: 'Admin',
      };

      // Creación de token:
      const token = Auth.createJWT(payload);

      // Le damos el token al usuario como respuesta JSON:
      // Agregamos el Status 202 que es el correcto para login:
      resp.status(202);
      resp.json({
        results: {
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
