import { ThingsFileRepo } from '../repository/things.file.repo';
import { ThingsController } from './things.controller';
import { NextFunction, Request, Response } from 'express';

describe('Given ThingsController', () => {
  // A ThingsController hay que darle un repo:
  // Con lo que hay que mockear un repo del tipo ThingsFileRepo.
  // Dentro mockear las funciones.
  const repo: ThingsFileRepo = {
    create: jest.fn(),
    query: jest.fn(),
    queryId: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  // Mockear req, resp y next:

  const req = {
    body: {},
    params: { id: '' },
  } as unknown as Request;
  const resp = {
    json: jest.fn(),
  } as unknown as Response;
  const next = jest.fn() as unknown as NextFunction;

  const controller = new ThingsController(repo);

  describe('When getAll method is called', () => {
    // Al ser los métodos del Controller async, hay que agregarle al test.
    test('Then if there is NO error, ', async () => {
      // Llamamos a la función con el await:
      await controller.getAll(req, resp, next);

      // Vemos que la función del repo haya sido llamada.
      expect(repo.query).toHaveBeenCalled();

      // Vemos que el resp.json() haya sido llamada.
      expect(resp.json).toHaveBeenCalled();
    });

    // CASO DE ERROR.
    test('Then if there is error, ', async () => {
      // Hacemos el mock de la función del repo para que sea Reject y genere el error
      (repo.query as jest.Mock).mockRejectedValue(new Error());

      await controller.getAll(req, resp, next);
      expect(repo.query).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
});
