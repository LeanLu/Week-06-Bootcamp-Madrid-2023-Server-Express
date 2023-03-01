// Aquí se coloca la interface del repo.
// NO va en models porque no modela ningún dato.
// Es particular de los repos en general. TODOS.

// "T": Utilizamos como abreviatura de type.
export interface Repo<T> {
  query(): Promise<T[]>;
  queryId(_id: string): Promise<T>;
  create(_info: Partial<T>): Promise<T>;
  update(_info: Partial<T>): Promise<T>;
  destroy(_id: string): Promise<void>;
  search(query: { key: string; value: unknown }): Promise<T[]>;
  // El "search" podría ser opcional para que no haya que agregarlo en things.
  // En este caso lo dejamos obligatorio y lo agregamos en ThingsRepo.
}

// En queryId y destroy se coloca string de momento.
// Sino hay que indicarle que "T" va a tener una propiedad "id".

// Colocamos la barra baja delante de cada parámetro porque aquí no se utilizan. Es solo la definición de la interface.

// Create y update se coloca Partial porque no se tienen todos los datos.
// Como mínimo le falta el ID que se genera en el repo.
