import { ThingStructure } from './thing.model';

export type UserStructure = {
  id: string;
  email: string;
  password: string;
  // Things es de cosas creadas:
  things: ThingStructure[];
  // Favorites tiene la misma estructura que things de cosas creadas, pero se guardan cosas distintas.
  // favorites: ThingStructure[];
};

// Agregamos la propiedad "things" para establecer la bidireccionalidad con el user asignado.
// Lo colocamos como Array porque pueden ser varias cosas que puede tener un solo usuario.
