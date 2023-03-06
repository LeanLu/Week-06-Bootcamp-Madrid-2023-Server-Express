import { errorsMiddleware } from './errors.middleware';
import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { HTTPError } from '../errors/errors';

describe('Given errorsMiddleware', () => {
  const req = {} as unknown as Request;

  const resp = {
    status: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  describe('When the error is a Mongoose CastError', () => {
    test('Then the status should be 400', () => {
      // Si lo instancio:
      // const error = new MongooseError.CastError('Error', 400,'')
      // Sino, puedo simular:
      const error = new MongooseError.CastError('test', 400, 'test');

      errorsMiddleware(error, req, resp, next);
      expect(resp.status).toHaveBeenLastCalledWith(400);
    });
  });

  describe('When the error is a Mongoose ValidationError', () => {
    test('Then ', () => {
      const error = new MongooseError.ValidationError();

      errorsMiddleware(error, req, resp, next);
      expect(resp.status).toHaveBeenLastCalledWith(406);
    });
  });

  describe('When the error is a CustomError, HTTPError with satusCode', () => {
    test('Then ', () => {
      const testNumber = 418;
      const error = new HTTPError(testNumber, 'test', 'test');

      errorsMiddleware(error, req, resp, next);
      expect(resp.status).toHaveBeenLastCalledWith(testNumber);
    });
  });

  describe('When the error is any other Error', () => {
    test('Then ', () => {
      const error = new Error('test');

      errorsMiddleware(error, req, resp, next);

      // Opción anterior:
      // expect(resp.status).toHaveBeenCalledWith(500);
      // El toHaveBeenLastCalledWith se coloca para asegurar que el último llamado se ha realizado con ese número.
      expect(resp.status).toHaveBeenLastCalledWith(500);
    });
  });
});
