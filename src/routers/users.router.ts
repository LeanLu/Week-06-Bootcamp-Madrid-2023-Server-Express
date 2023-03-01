import { Router as router } from 'express';
import { UsersController } from '../controllers/users.controller.js';
import { UsersMongoRepo } from '../repository/users.mongo.repo.js';

export const usersRouter = router();
const repo = new UsersMongoRepo();
const controller = new UsersController(repo);

// Vamos a tener solo 2 rutas de Post:
// Le cambiamos las subrutas porque no se pueden tener 2 post iguales:

// Subruta para register:
usersRouter.post('/register', controller.register.bind(controller));

// Subruta para login:
usersRouter.post('/login', controller.login.bind(controller));
