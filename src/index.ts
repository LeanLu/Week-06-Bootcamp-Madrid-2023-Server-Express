// EJEMPLO DE EXPRESS:

// Convertir el require como import.
// Por defecto:
// const express = require('express');
// Convertido:
// import express from 'express';

// const app = express();
// const port = 3000;

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

import http from 'http';
import { app } from './app.js';
import { dbConnect } from './db/db.connect.js';

const PORT = process.env.PORT || 4500;

const server = http.createServer(app);

// Hacemos conexión a la base de datos Atlas.
// Devuelve la promesa de conectar.
// Por eso hacemos un .then(). NO puede ser async await porque es de alto nivel y no se puede utilziar.
// Luego del .then() tomo mongoose que sería el Object de la conexión que devolvería la promesa al conectarse.
dbConnect()
  .then((mongoose) => {
    // Si todo va bien, ponemos a escuchar al server.
    server.listen(PORT);
    // Hacemos un console.log con mensaje de mongoose donde indica el nombre de la base de datos para dar información.
    console.log('DB: ', mongoose.connection.db.databaseName);

    // Si falla la conexión hacemos un server.emit para que sea tomado por el server.on.
    // Lo llamamos 'error' en el emit para que sea agarrado por el server.on 'error'
  })
  .catch((error) => server.emit('error', error));

// Gestionamos el error emitido por el server.emit del catch del dbConnect:
server.on('error', (error) => {
  console.log('Server error', error.message);
});

server.on('listening', () => {
  console.log('Listening http://localhost: ' + PORT);
});
