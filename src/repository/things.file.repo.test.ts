import { ThingsFileRepo } from './things.file.repo';
import fs from 'fs/promises';
import { ThingStructure } from '../entities/thing.model';

// Hacemos el mock de fs/promises.
jest.mock('fs/promises');

describe('Given ThingsFileRepo repository', () => {
  // ARRANGE:
  const repo = new ThingsFileRepo();

  describe('When the repo is instance', () => {
    test('Then the repo should be instance of ThingsFileRepo', () => {
      expect(repo).toBeInstanceOf(ThingsFileRepo);
    });
  });

  describe('When the query is used', () => {
    beforeEach(() => {
      // ARRANGE:
      // Dar implementación a la función.
      // Para eso primero hay que hacer aserción de tipo.
      // Hacer que devuelva un valor de string porque es lo que devuelve la Promise.
      (fs.readFile as jest.Mock).mockResolvedValue('[]');

      // ACT:
      repo.query();
    });

    test('Then it should return the data ', () => {
      // ASSERT:
      expect(fs.readFile).toHaveBeenCalled();
    });
  });

  // Si quiero hacer un test con probando el resultado:
  describe('When the query is used', () => {
    let result: ThingStructure[];
    beforeEach(async () => {
      (fs.readFile as jest.Mock).mockResolvedValue('[]');

      result = await repo.query();
    });

    test('Then it should return the data ', () => {
      expect(result).toEqual([]);
      // Espera un Array porque devuelve el Array
    });
  });

  // PARA QUERY ID:
  describe('When the query ID is used', () => {
    test('Then if it has an object with a valid ID, it should return the object ', async () => {
      // Le tenemos que dar como valor un Array con Objeto para que pueda hacer el find y no de undefined.
      (fs.readFile as jest.Mock).mockResolvedValue('[{"id": "1"}]');
      const id = '1';
      const result = await repo.queryId(id);
      expect(fs.readFile).toHaveBeenCalled();
      // Luego nos devuelve solo el objeto que encuentra del find.
      expect(result).toEqual({ id: '1' });
    });

    test('Then if it has an object with NO valid ID, it should throw an Error ', async () => {
      // Cambiamos el ID para que el find no encuentre el object.
      (fs.readFile as jest.Mock).mockResolvedValue('[{"id": "2"}]');
      const id = '1';

      // NUNCA puedo poner el .toThrow línea después de la línea donde se genera porque nunca llegaría al chequeo.
      // const result = await repo.queryId(id);
      // expect(result).toThrow();

      // Entonces tiene que estar en la misma línea el expect con la función que se ejecuta y tiraría el error.
      // Y además, debe estar en una callback para que funcione.
      // Además, cuando es Async hay que agregar el "rejects"
      expect(async () => await repo.queryId(id)).rejects.toThrow();
    });
  });
});
