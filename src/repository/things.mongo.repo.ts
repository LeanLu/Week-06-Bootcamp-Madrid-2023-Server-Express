import { ThingStructure } from '../entities/thing.model';
import { HTTPError } from '../errors/errors.js';
import { Repo } from './repo.interface';
import { ThingModel } from './things.mongo.model.js';

// Agregamos el debug con información para la consola:
import createDebug from 'debug';
const debug = createDebug('W6:repo');

export class ThingsMongoRepo implements Repo<ThingStructure> {
  constructor() {
    debug('Repo instanced');
  }

  async query(): Promise<ThingStructure[]> {
    debug('query method');
    // Query de mongoose son como una Promise.
    // Para leer el conjunto de datos de la colección.
    // Le agregamos el método populate para incluir toda la información adicional.
    // Dentro del model de Things, le pasamos el nombre de la propiedad que tenga una ref a los datos que queremos que popule
    // Le podemos dar otro parámetro opcional con las cosas que no queremos que aparezca.
    // En este caso la ref es 'User'.
    // Luego le damos la excepción que no queremos que muestre. Ex.: "things" y hay que darle un valor de cero.
    const data = await ThingModel.find().populate('owner', { things: 0 });
    return data;
  }

  async queryId(id: string): Promise<ThingStructure> {
    debug('queryID method');
    // Para la búsqueda por ID.
    const data = await ThingModel.findById(id).populate('owner', { things: 0 });

    // Verificamos que haya un data y no sea undefined.
    // Utilizamos el error que generamos en la interface.

    if (!data) throw new HTTPError(404, 'Not found', 'ID not found in queryID');

    return data;
  }

  async create(info: Partial<ThingStructure>): Promise<ThingStructure> {
    debug('create method');
    const data = await ThingModel.create(info);

    return data;
  }

  async update(info: Partial<ThingStructure>): Promise<ThingStructure> {
    debug('update method');
    // Para búsqueda por ID y luego actualizar.
    // Pide 2 parámetros. El ID y los datos a actualizar.
    // Suponemos que info siempre trae ID.

    // En este caso como hace "find" y "update" devuelve el resultado del primero.
    // Entonces devolvería los datos originales sin modificar.
    // Entonces hay agregarle al data un object modificador "new:true".
    const data = await ThingModel.findByIdAndUpdate(info.id, info, {
      new: true,
    });

    // También podría ser undefined si no encuentra:
    if (!data) throw new HTTPError(404, 'Not found', 'ID not found in update');

    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async destroy(id: string): Promise<void> {
    debug('destroy method');
    const data = await ThingModel.findByIdAndDelete(id);

    // Podría devolver undefined si no encuentra el data entonces se hace gestión de error:
    if (!data)
      throw new HTTPError(
        404,
        'Not found',
        'Delete not possible: ID not found '
      );

    // Pero luego no devolvemos nada porque es una Promise void.
  }

  // Agregamos el método "search" que necesitábamos para el repo user para que cumpla con la interface.
  async search(query: {
    key: string;
    value: unknown;
  }): Promise<ThingStructure[]> {
    debug('search method');
    const data = await ThingModel.find({ [query.key]: query.value }).exec();
    return data;
  }
}
