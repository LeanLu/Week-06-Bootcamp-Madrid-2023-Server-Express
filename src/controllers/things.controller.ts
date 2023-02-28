import { NextFunction, Request, Response } from 'express';
import { ThingStructure } from '../entities/thing.model';
import { Repo } from '../repository/repo.interface';

// Agregamos el debug con información para la consola:
import createDebug from 'debug';
const debug = createDebug('W6:controller');

export class ThingsController {
  // Le agregamos en el constructor la inyección de dependencia del repo:
  constructor(public repo: Repo<ThingStructure>) {
    this.repo = repo;
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

  async post(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('post method');
      const data = await this.repo.create(req.body);
      resp.json({
        results: [data],
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
