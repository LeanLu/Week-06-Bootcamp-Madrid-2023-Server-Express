import { NextFunction, Request, Response } from 'express';
import { ThingStructure } from '../entities/thing.model';
import { Repo } from '../repository/repo.interface';

// Agregamos el debug con información para la consola:
import createDebug from 'debug';
import { RequestPlus } from '../interceptors/logged';
import { UserStructure } from '../entities/user.model';
import { HTTPError } from '../errors/errors.js';
const debug = createDebug('W6:controller');

export class ThingsController {
  // Le agregamos en el constructor la inyección de dependencia del repo:
  constructor(
    public repo: Repo<ThingStructure>,
    public repoUser: Repo<UserStructure>
  ) {
    this.repo = repo;
    this.repoUser = repoUser;
    debug('Controller instanced');
  }

  // Todos los métodos van a ser Async porque el Repo es async.
  // Todas promesas del Controller son void.
  // Entonces no es necesario esperar con await.

  // Hay que dar una respuesta Estándar para todos:

  // Además hay que agregar un try-catch para agarrar los errors en caso que no tengamos respuesta del repo.

  async getAll(_req: Request, resp: Response, next: NextFunction) {
    try {
      debug('getAll method');
      const data = await this.repo.query();
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('get method');
      const data = await this.repo.queryId(req.params.id);
      // Si queremos se podría mostrar el dato por consola:
      // console.log(data);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async post(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      debug('post method');

      const userId = req.info?.id;

      // Como el ID podría ser undefined, hay que hacer un resguardo:
      if (!userId) throw new HTTPError(404, 'Not found', 'Not found user ID');

      // Verificamos ese ID a través queryId del Repo User:
      // Devuelve una promesa de User así que hay que poner un await.
      // En este caso no hay que poner un resguardo si no encuentra porque el repo de User ya tira un error si no encuentra.
      // Si tira un error, es agarrado por el Catch.
      // Guardamos al usuario encontrado dentro de una variable.
      const actualUser = await this.repoUser.queryId(userId);

      // Tomamos de info el ID y se la agregamos al owner del body.
      // En info tenemos los datos del usuario que tomamos desde el Token.
      req.body.owner = userId;

      const newThing = await this.repo.create(req.body);

      // Ahora hay que agregar la cosa creada en el Array de cosas de este usuario en particular:
      // Dentro del Array things del usuario, le hacemos un push del data creado.
      // Hacemos un push que muta el Array que se encuentra dentro de la propiedad "things" del Object del User:
      actualUser.things.push(newThing);

      // Luego hay que hacer un Patch para actualizar los datos del User  en la base de datos.
      // Le damos como parámetro el actual User que ya hemos mutado con el push:
      this.repoUser.update(actualUser);

      resp.json({
        results: [newThing],
      });
    } catch (error) {
      next(error);
    }
  }

  // Para el Patch el ID podría estar en la URL o sino en el Object. Eso se realiza desde el front.
  // Lo más común es que venga en la URL.
  async patch(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('patch method');
      // Verificamos si el ID viene por URL o por parámetros del body y tomamos el que corresponda:
      req.body.id = req.params.id ? req.params.id : req.body.id;

      const data = await this.repo.update(req.body);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('delete method');
      const data = await this.repo.destroy(req.params.id);
      resp.json({
        results: [],
      });
    } catch (error) {
      next(error);
    }
  }
}
