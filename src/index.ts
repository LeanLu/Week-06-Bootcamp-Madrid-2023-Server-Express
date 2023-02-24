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

const PORT = process.env.PORT || 4500;

const server = http.createServer(app);

server.listen(PORT);

server.on('error', () => {});

server.on('listening', () => {
  console.log('Listening http://localhost: ' + PORT);
});
