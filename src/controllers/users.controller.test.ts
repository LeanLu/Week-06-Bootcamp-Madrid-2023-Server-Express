import { UsersController } from './users.controller';
import { NextFunction, Request, Response } from 'express';
import { UserStructure } from '../entities/user.model';
import { Repo } from '../repository/repo.interface';

// Importamos el Auth porque necesitamos utilizar los métodos.
// Aunque esté mockeado.
import { Auth } from '../helpers/auth.js';

// Mockeamos el Auth.
// Queda el módulo mockeado.
jest.mock('../helpers/auth.js');

describe('Given Register method from UsersController', () => {
  // Hay que instanciar la Class UsersController.
  // Necesita un repo.
  // Puedo colocar solo los métodos que quiero.
  // Pero entonces hay que hacer una aserción de tipo porque sino estaría pidiendo el resto de los métodos.
  const mockRepo = {
    create: jest.fn(),
    search: jest.fn(),
  } as unknown as Repo<UserStructure>;

  const controller = new UsersController(mockRepo);

  // Hacemos el mock de resp y next:
  // Dejamos el req porque tiene que ir cambiando en cada test:

  // Dentro de resp se utiliza el status y json:
  const resp = {
    status: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  describe('When there is no email in body', () => {
    // Si pasa por la línea de error, entra en el try-catch.

    // Dentro de req queremos un body:
    const req = {
      body: {
        password: 'test',
      },
    } as Request;

    test('Then next function should be called', async () => {
      // Hay que hacerlo async porque el método es async.
      // Entonces hay que esperar que resuelva para asegurar que ejecute el error:
      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When there is no password in body', () => {
    const req = {
      body: {
        email: 'test',
      },
    } as Request;

    test('Then next function should be called', async () => {
      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When there is a correct password and email in body', () => {
    // Dentro de req queremos un body con email y password:
    const req = {
      body: {
        email: 'test',
        password: 'test',
      },
    } as Request;

    test('Then resp.status and resp.json should be called', async () => {
      await controller.register(req, resp, next);
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
  });
});

describe('Given Login method from UsersController', () => {
  const mockRepo = {
    create: jest.fn(),
    search: jest.fn(),
  } as unknown as Repo<UserStructure>;

  const controller = new UsersController(mockRepo);

  const resp = {
    status: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  // Mockeamos el método estático de Auth.compare.
  // Le damos un valor para que pueda resolver en la línea de comprobación del controller:
  Auth.compare = jest.fn().mockResolvedValue(true);

  describe('When there is the data completed', () => {
    const req = {
      body: {
        email: 'test',
        password: 'test',
      },
    } as Request;

    // Search está mockeado, pero no está implementado.
    // Es decir, no tiene valor. Devolvería undefined.
    // Hacemos que devuelva lo que pide el controller para pasar Ok.
    // El método search devuelve una promise.
    // Entonces el mock tiene que devolver una promise también.
    (mockRepo.search as jest.Mock).mockResolvedValue(['test']);

    test('Then resp.json and resp.status should have been called', async () => {
      await controller.login(req, resp, next);
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
  });
});
