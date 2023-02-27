import fs from 'fs/promises';

// Creamos una const con el fichero que vamos a utilizar como base de datos:
const file = './data/data.json';

// Operaciones con el fichero de datos json o base de datos:

export class ThingsFileRepo {
  read() {
    // Ejecutamos el método readFile de fs/promise para leer el fichero:
    // Del primer fs.readFile devuelve un "data" al cual lo recogemos en then para luego aplicar un parse.
    // Para evitar que sea una promise void, hay que aplicar un "return" al inicio.
    // Esto devuelve una promise que luego va a ser tratada en el método del Controller.
    return fs
      .readFile(file, { encoding: 'utf-8' })
      .then((data) => JSON.parse(data) as any[]);
  }

  create() {}
  update() {}
  delete() {}
}
