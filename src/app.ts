import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { thingsRouter } from './routers/things.router.js';

// Importamos la variable debug:
import createDebug from 'debug';
import { CustomError } from './errors/errors.js';
import { usersRouter } from './routers/users.router.js';
import path from 'path';
import { __dirname } from './config.js';

// En este caso, le agregamos al nombre que estamos en "app":
const debug = createDebug('W6:app');

export const app = express();

app.disable('x-powered-by');

const corsOptions = {
  origin: '*',
};

app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));
// En principio el Cors lo dejamos sin valor para que sea lo más abierto pero luego hay que darle valor para no tener problemas con Sonar.
// Por eso le pusimos el corsOptions, pero con el * para darle el valor más universal posible.

// Middlewares:
// Dentro de app el método use:
// Espera un callback para que lo use:
app.use((_req, _resp, next) => {
  debug('Soy un middleware');
  next();
});

debug(__dirname);
app.use(express.static(path.resolve(__dirname, 'public')));

// _________________________________________________________________
// MÉTODO PARA HACERLO CON ROUTER (MÉTODO A UTILIZAR):
// Ejemplo con things:

// Definimos la ruta y el Router a utilizar:
app.use('/things', thingsRouter);

// Agregamos la ruta de users:
app.use('/users', usersRouter);

// _________________________________________________________________
// MÉTODO SIMPLIFICADO PARA CREACIÓN DE RUTAS (NO UTILIZAR):
// Ejemplo con Home.
// Defino la ruta donde quiero que pasen ciertas cosas que definimos a continuación:
app.get('/', (_req, resp) => {
  // Uno de los métodos para enviar la respuesta.
  // resp.end();
  // Para definir una cabecera:
  // resp.header();
  // Para definir el número de status.
  // resp.status();

  // Para responder con json:
  // Del que más vamos a utilizar.
  // Si utilizamos este, no hay que utilizar end, o header.
  // resp.json();
  // Para enviar la respuesta json.
  // resp.send();
  // Por eso no utilizamos el header y end.

  // Ejemplo para envío de datos:
  // resp.json({
  //   name: 'Chizzo',
  //   age: 34,
  // });

  // En general en el GET prinicipal base, se colocan los endpoints disponibles:
  resp.json({
    info: 'Bootcamp APIs',
    endpoints: {
      things: '/things',
    },
  });
});

app.get('/:id', (req, resp) => {
  // Para levantar los parámetros que quiero tomar.
  // En este caso le colocamos "id" como nombre de la variable.

  resp.send('Hola ' + req.params.id);
});

app.post('/', (req, resp) => {
  req.body.id = 12;
  // Hacemos una respuesta json para enviar los datos que han llegado en el body del Post.
  resp.json(req.body);
});

app.patch('/:id');

app.delete('/:id');

app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (error: CustomError, _req: Request, resp: Response, _next: NextFunction) => {
    debug('Soy el middleware de errores');

    // Definimos la constante status con el statusCode que haya venido y si no vino nada, se queda con el 500:
    const status = error.statusCode || 500;
    // Lo mismo para el mensaje:
    const statusMessage = error.statusMessage || 'Internal server error';

    // Definimos el Status de la respuesta:
    resp.status(status);

    // Se envía la respuesta como json porque esto lo recibe la consola del usuario.
    // Se envíán las variables definidas arriba.
    resp.json({
      error: [
        {
          status,
          statusMessage,
        },
      ],
    });
    // Luego enviamos la información por consola interna:
    debug(status, statusMessage, error.message);
  }
);
