import fs from 'fs/promises';
import { ThingStructure } from '../entities/thing.model';
import { Repo } from './repo.interface';

// Creamos una const con el fichero que vamos a utilizar como base de datos:
const file = './data/data.json';

// Operaciones con el fichero de datos json o base de datos:

export class ThingsFileRepo implements Repo<ThingStructure> {
  async query(): Promise<ThingStructure[]> {
    // Ejecutamos el método readFile de fs/promise para leer el fichero:
    // Del primer fs.readFile devuelve un "data" al cual lo recogemos en then para luego aplicar un parse.
    // Para evitar que sea una promise void, hay que aplicar un "return" al inicio.
    // Esto devuelve una promise que luego va a ser tratada en el método del Controller.
    // ANTES con el .then():
    // return fs
    //   .readFile(file, { encoding: 'utf-8' })
    //   .then((data) => JSON.parse(data));

    // El data que devuelve la lectura de un fichero es un string:
    const initialData: string = await fs.readFile(file, { encoding: 'utf-8' });

    return JSON.parse(initialData);
  }

  async queryId(id: string): Promise<ThingStructure> {
    const initialData: string = await fs.readFile(file, { encoding: 'utf-8' });
    const data: ThingStructure[] = JSON.parse(initialData);

    // El "find" devuelve un objeto. El que encuentra.
    const finalData = data.find((item) => item.id === id);

    // Podría enviar un "id" que no se encuentre y entonces devolvería undefined.
    // Hay que gestionar ese error.

    if (!finalData) throw new Error('Id not found');

    return finalData;
  }

  async create(info: Partial<ThingStructure>): Promise<ThingStructure> {
    // En caso que hagamos una validación de datos en el Backend tendríamos una función y verificamos su return:
    // if(!validateInfo(info)) throw new Error ('Not valid data')

    const initialData: string = await fs.readFile(file, { encoding: 'utf-8' });
    const data: ThingStructure[] = JSON.parse(initialData);

    // Tendría que haber un mecanismo de creación de ID.

    info.id = String(Math.floor(Math.random() * 1_000_000));

    // Agregamos la info al Array de data:
    const finalData = [...data, info];

    // Se podría hacer también un data.push(info) porque en este caso no importa la mutación del array.

    // Lo convertimos en String para luego escribir en el file.
    const stringFinalData = JSON.stringify(finalData);

    // Escribimos el file con la info final.
    await fs.writeFile(file, stringFinalData, 'utf-8');

    return info as ThingStructure;
    // Le agregamos la aserción de tipo porque suponemos que la "info" viene con todos los datos completos y solo le falta el "id".
    // Luego al trabajar con base de datos, allí se verifica que estén todos los datos para poder devolver "info" sin tener que hacer la aserción.
  }

  async update(info: Partial<ThingStructure>): Promise<ThingStructure> {
    // Aquí hay que verificar que tenga ID:
    if (!info.id) throw new Error('Not valid data');

    const initialData: string = await fs.readFile(file, { encoding: 'utf-8' });

    const data: ThingStructure[] = JSON.parse(initialData);

    // Le asignamos un valor vacío para hacer una aserción de tipo y Typescript no se queje.
    // Luego sabemos que va a entrar en el .map y el updateItem va a ser del tipo ThingStructure.
    let updateItem: ThingStructure = {} as ThingStructure;

    // Para el map hacemos una desestructuración tanto de la información que tenemos como de la que llega para poder fusionar los 2 datos.
    // Al poder ser "info" un Partial, si solo me quedo con info, perdería el resto de propiedades que el usuario no editó.
    const finalData = data.map((item) => {
      if (item.id === info.id) {
        updateItem = { ...item, ...info };
        return updateItem;
      }

      return item;
    });

    // Volvemos a verificar que tenga el "id".
    if (!updateItem.id) throw new Error('Id not found');

    const stringFinalData = JSON.stringify(finalData);

    await fs.writeFile(file, stringFinalData, 'utf-8');

    return updateItem as ThingStructure;
  }

  async destroy(id: string): Promise<void> {
    const initialData: string = await fs.readFile(file, { encoding: 'utf-8' });

    const data: ThingStructure[] = JSON.parse(initialData);

    // Podemos realizar un findIndex para buscar el ítem.
    // Devuelve un número positivo si lo encuentra.
    // Si no lo encuentra devuelve un número negativo y con eso puedo gestionar la búsqueda del ítem.
    const index = data.findIndex((item) => item.id === id);

    if (index < 0) throw new Error('Id not found');

    // Si pasa el if es que lo encontró, así que lo borramos con slice:
    data.slice(index, 1);

    const stringFinalData = JSON.stringify(data);

    // NO es necesario colocar await porque es una Promise void.
    // Entonces no es necesario esperar a que se resuelva porque no espero que me devuelva algo.
    // Con await sería:
    // await fs.writeFile(file, stringFinalData, 'utf-8');
    fs.writeFile(file, stringFinalData, 'utf-8');
  }
}
