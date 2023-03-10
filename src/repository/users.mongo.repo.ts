import { UserStructure } from '../entities/user.model';
import { HTTPError } from '../errors/errors.js';
import { Repo } from './repo.interface';
import { UserModel } from './users.mongo.model.js';
import createDebug from 'debug';

const debug = createDebug('W6:users.repo');

export class UsersMongoRepo implements Repo<UserStructure> {
  // Patrón Singleton:
  // Evitar duplicaciones de instancia de class.

  // Generamos la propiedad instance private.
  private static instance: UsersMongoRepo;

  // Creamos el método public para poder instanciar la class.
  // Pero para poder instanciar la class primero verifica que no haya sido instanciada antes.
  public static getInstance(): UsersMongoRepo {
    if (!UsersMongoRepo.instance) {
      UsersMongoRepo.instance = new UsersMongoRepo();
    }

    return UsersMongoRepo.instance;
  }

  // Hacemos el constructor privado para que no sea instanciado desde afuera como new...
  // Solo se podrá instanciar a través del método público getInstance creada arriba.
  private constructor() {
    debug('Repo instanced');
  }

  async query(): Promise<UserStructure[]> {
    debug('query method');
    // Como no va a utilizar este método, lo dejamos para que cumpla con el implements de Repo.
    // Pero hacemos que devuelva un Array vacío.
    // const data = await UserModel.find();

    // Hacemos el populate de las things para que cada usuario pueda ver las propiedades de sus things.
    // Pero sacamos el "owner" porque sería redundante que cada usuario se vea así mismo como owner.
    const data = await UserModel.find().populate('things', { owner: 0 });

    return data;
  }

  async queryId(id: string): Promise<UserStructure> {
    debug('queryID method');
    const data = await UserModel.findById(id);
    if (!data) throw new HTTPError(404, 'Not found', 'ID not found in queryID');
    return data;
  }

  // Método agregado para poder hacer el login del usuario.
  // El método es llamado desde el método login del Controller.
  async search(query: {
    key: string;
    value: unknown;
  }): Promise<UserStructure[]> {
    debug('search method');

    // Hay que darle como parámetro los valores generales del "query".
    // Para encontrar el valor que tiene key y darlo como parámetro, hay que utilizar el método del corchete para identificar las key que están en variables.
    const data = await UserModel.find({ [query.key]: query.value });
    // Esto devuelve una query que es un Array porque hacemos un find genérico.
    // Entonces podría encontrar varios o sino ser un Array vacío.
    // NUNCA devuelve un null.
    // No podríamos hacer el if(!data).
    // Podríamos verificar la longitud del Array.
    // En este caso vamos a hacer la verificación en el Controller.

    return data;
  }

  async create(info: Partial<UserStructure>): Promise<UserStructure> {
    debug('create method');
    const data = await UserModel.create(info);
    return data;
  }

  async update(info: Partial<UserStructure>): Promise<UserStructure> {
    debug('update method');
    const data = await UserModel.findByIdAndUpdate(info.id, info, {
      new: true,
    });
    if (!data) throw new HTTPError(404, 'Not found', 'ID not found in update');
    return data;
  }

  async destroy(id: string): Promise<void> {
    debug('destroy method');
    const data = await UserModel.findByIdAndDelete(id);
    if (!data)
      throw new HTTPError(
        404,
        'Not found',
        'Delete not possible: ID not found '
      );
  }
}
