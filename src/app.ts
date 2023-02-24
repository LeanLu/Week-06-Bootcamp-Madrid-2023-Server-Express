import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { thingsRouter } from './router/things.router.js';

export const app = express();

app.disable('x-powered-by');

const corsOptions = {
  origin: '*',
};

app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));
// En principio el Cors lo dejamos sin valor para que sea lo más abierto pero luego hay que darle valor para no tener problemas con Sonar.

// Middlewares:
// Dentro de app el método use:
// Espera un callback para que lo use:
app.use((_req, _resp, next) => {
  console.log('Soy un middleware');
  next();
});

// _________________________________________________________________
// MÉTODO PARA HACERLO CON ROUTER (A UTILIZAR):
// Ejemplo con things:

// Definimos la ruta y el Router a utilizar:
app.use('/things', thingsRouter);

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
  // Por eso no utilizamos el header y end.
  // resp.send();

  // Ejemplo para envío de datos:
  resp.json({
    name: 'Chizzo',
    age: 34,
  });
});

app.get('/:id', (req, resp) => {
  // Para levantar los parámetros que quiero tomar.
  // En este caso le colocamos "id" como nombre.

  resp.send('Hola ' + req.params.id);
});

app.post('/', (req, resp) => {
  req.body.id = 12;
  // Hacemos una respuesta json para enviar los datos que han llegado en el body del Post.
  resp.json(req.body);
});

app.patch('/:id');

app.delete('/:id');
