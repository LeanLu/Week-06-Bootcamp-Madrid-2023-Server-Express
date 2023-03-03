import { Router as router } from 'express';
import { UsersController } from '../controllers/users.controller.js';
import { authorized } from '../interceptors/authorized.js';
import { logged } from '../interceptors/logged.js';
import { UsersMongoRepo } from '../repository/users.mongo.repo.js';

export const usersRouter = router();
// Utilizamos el método public de UserMongoRepo para instanciarlo que primero verifica si no fue ya instanciado antes.
const repo = UsersMongoRepo.getInstance();
const controller = new UsersController(repo);

// Vamos a tener solo 2 rutas de Post:
// Le cambiamos las subrutas porque no se pueden tener 2 post iguales:

// Subruta para cargar los users:

usersRouter.get('/', logged, controller.getAll.bind(controller));

// Subruta para register:
usersRouter.post('/register', controller.register.bind(controller));

// Subruta para login:
usersRouter.post('/login', controller.login.bind(controller));

// Subruta para favorites:
// Hay que darle el ID del user que va a realizar el Patch.
// Va a realizar un Add, Change y Delete dentro de los Favorites.
// Lo que modificaría es el Array de Favorites.
// usersRouter.patch(
//   '/add_favorites/:id',
//   logged,
//   authorized,
//   controller.addFav.bind(controller)
// );
// usersRouter.patch(
//   '/change_favorites/:id',
//   logged,
//   authorized,
//   controller.changeFav.bind(controller)
// );
// usersRouter.patch(
//   '/delete_favorites/:id',
//   logged,
//   authorized,
//   controller.deleteFav.bind(controller)
// );
