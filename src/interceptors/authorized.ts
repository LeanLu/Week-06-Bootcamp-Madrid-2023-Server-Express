import { NextFunction, Response } from 'express';
import { HTTPError } from '../errors/errors.js';
import { ThingsMongoRepo } from '../repository/things.mongo.repo.js';
import { RequestPlus } from './logged.js';

export async function authorized(
  req: RequestPlus,
  _resp: Response,
  next: NextFunction,
  thingsRepo: ThingsMongoRepo
) {
  try {
    // Para buscar la Thing tenemos que utilizar el Repo.
    // En este caso al ser una function, NO podemos hacer una inyección de dependencia.
    // Por NO inyectar depedencia, hay que hacer la instancia del Repo dentro de la función.
    // const thingsRepo = ThingsMongoRepo.getInstance();

    // Como el User ID podría ser undefined hacemos una guarda:
    if (!req.info)
      throw new HTTPError(
        404,
        'Not found',
        'Token not found in authorized interceptor'
      );

    // Guardamos el User ID:
    const userId = req.info.id;

    // Guardamos el Things ID:
    const thingId = req.params.id;

    // Como le pasamos el ThingsRepo desde afuera, no hace falta instanciarlo acá y podemos utilizar sus métodos:
    // Como devuelve una promesa, hay que colocarle el await.
    // Si falla la búsqueda, el repo ya lanza el error, entonces no sería necesario hacer una guarda:
    const thing = await thingsRepo.queryId(thingId);

    // Comparamos el ID guardado en el owner con el User (req.info.id):
    // Si no son iguales, es que el usuario
    if (thing.owner.id !== userId)
      throw new HTTPError(
        401,
        'Not authorized',
        'User ID is different from Owner ID'
      );

    next();
  } catch (error) {
    next(error);
  }
}
