import { UserStructure } from './user.model';

export type ThingStructure = {
  id: string;
  name: string;
  interestingScore: number;
  importantScore: number;
  owner: UserStructure;
};

/*
Relaciones:
1 - n
Un usuario con "n" cosas.
Una cosa propiedad de 1 usuario (modelado por nosotros).


n - n
Una cosa para varios usuarios.
*/

// Agregamos la propiedad "owner" y le damos el tipo "User" para establecer una relación entre los 2.
// Así es la relación de 1-n
// Si fuese de n-n tendría que ir un Array:
// owner: UserStructure[];
