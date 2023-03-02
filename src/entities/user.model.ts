import { ThingStructure } from './thing.model';

export type UserStructure = {
  id: string;
  email: string;
  password: string;
  things: ThingStructure[];
};

// Agregamos la propiedad "things" para establecer la bidireccionalidad con el user asignado.
// Lo colocamos como Array porque pueden ser varias cosas que puede tener un solo usuario.
