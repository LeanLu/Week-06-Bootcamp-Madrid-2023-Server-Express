/* eslint-disable new-cap */

import { Router } from 'express';
import { ThingsController } from '../controllers/things.controller.js';
import { ThingsFileRepo } from '../repository/things.file.repo.js';

export const thingsRouter = Router();

// Instanciamos la class ThingsFileRepo para utilizar los métodos del repo:
const repo = new ThingsFileRepo();

// Instanciamos la class ThingsController para utilizar los métodos:
// Le hacemos una inyección de dependencia al controller con el repo:
const controller = new ThingsController(repo);

// Similar al app.get(), etc.:
// En las callbacks llamamos a los métodos del Controller:
// Los métodos tienen que estar bind() para que funcionen.
thingsRouter.get('/', controller.getAll.bind(controller));

thingsRouter.get('/:id', controller.get.bind(controller));

thingsRouter.post('/', controller.post.bind(controller));

thingsRouter.patch('/:id', controller.patch.bind(controller));

thingsRouter.delete('/:id', controller.delete.bind(controller));
