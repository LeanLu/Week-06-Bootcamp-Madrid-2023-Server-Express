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
// Y con el patrón Singleton:
const repoThing = ThingsMongoRepo.getInstance();

// Instanciamos también el repo de User para inyectarlo en el Controller de Things:
// Utilizamos el método public de UserMongoRepo para instanciarlo que primero verifica si no fue ya instanciado antes.
const repoUser = UsersMongoRepo.getInstance();

// Instanciamos la class ThingsController para utilizar los métodos:
// Le hacemos una inyección de dependencia al controller con el repo:
// Le inyectamos también el repo de User:
const controller = new ThingsController(repoThing, repoUser);

// Similar al app.get(), etc.:
// En las callbacks llamamos a los métodos del Controller:
// Los métodos tienen que estar bind() para que funcionen.

// Agregamos la protección de logged en la ruta get:
// Para ver las cosas podría ser opcional estar logueado.
thingsRouter.get('/', controller.getAll.bind(controller));
// También para ver alguna cosa por ID también podría ser opcional estar logueado.
thingsRouter.get('/:id', controller.get.bind(controller));

thingsRouter.post('/', logged, controller.post.bind(controller));

thingsRouter.patch(
  '/:id',
  logged,
  (req, resp, next) => authorized(req, resp, next, repoThing),
  controller.patch.bind(controller)
);

thingsRouter.delete(
  '/:id',
  logged,
  (req, resp, next) => authorized(req, resp, next, repoThing),
  controller.delete.bind(controller)
);
