/* eslint-disable new-cap */
import { Router } from 'express';
import { ThingsController } from '../controllers/things.controller.js';
import { authorized } from '../interceptors/authorized.js';
import { logged } from '../interceptors/logged.js';
import { ThingsMongoRepo } from '../repository/things.mongo.repo.js';
import { UsersMongoRepo } from '../repository/users.mongo.repo.js';
// Antes con los datos en FILE:
// import { ThingsFileRepo } from '../repository/things.file.repo.js';

export const thingsRouter = Router();

// Instanciamos la class ThingsFileRepo para utilizar los métodos del repo:
// Antes con los datos en FILE:
// const repo = new ThingsFileRepo();

// Ahora con Mongoose:
const repo = new ThingsMongoRepo();

// Instanciamos también el repo de User para inyectarlo en el Controller de Things:
const repoUser = new UsersMongoRepo();

// Instanciamos la class ThingsController para utilizar los métodos:
// Le hacemos una inyección de dependencia al controller con el repo:
// Le inyectamos también el repo de User:
const controller = new ThingsController(repo, repoUser);

// Similar al app.get(), etc.:
// En las callbacks llamamos a los métodos del Controller:
// Los métodos tienen que estar bind() para que funcionen.

// Agregamos la protección de logged en la ruta get:
// Para ver las cosas podría ser opcional estar logueado.
thingsRouter.get('/', logged, controller.getAll.bind(controller));
// También para ver alguna cosa por ID también podría ser opcional estar logueado.
thingsRouter.get('/:id', logged, controller.get.bind(controller));

thingsRouter.post('/', logged, controller.post.bind(controller));

thingsRouter.patch(
  '/:id',
  logged,
  authorized,
  controller.patch.bind(controller)
);

thingsRouter.delete(
  '/:id',
  logged,
  authorized,
  controller.delete.bind(controller)
);
