export interface CustomError extends Error {
  statusCode: number;
  statusMessage: string;
}

// Hereda de Error e implementa la interface del CustomError.
export class HTTPError extends Error implements CustomError {
  // Generamos un mensaje más genérico para el HTTP.
  // Y otro mensaje más técnico para mostrar por la consola.
  constructor(
    public statusCode: number,
    public statusMessage: string,
    public message: string,
    public options?: ErrorOptions
  ) {
    // Del padre, el Error nativo, hay que traer el message y options.
    // Que son las propiedades/métodos del Error nativo del cual "extends"
    super(message, options);
    // Le cambiamos el name de los errores nativos, para indicar que son errores del tipo HTTP en este caso.
    this.name = 'HTTP Error';
  }
}
