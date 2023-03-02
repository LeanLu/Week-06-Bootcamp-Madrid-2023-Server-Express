import { model, Schema } from 'mongoose';
import { ThingStructure } from '../entities/thing.model';

// Creamos un Schema de mongoose.
// Paracido a entity o models de antes.
const thingSchema = new Schema<ThingStructure>({
  // Defino los diferentes elementos como propiedades con un Object:

  name: {
    // Permite definir el tipo de JS. Utilizamos las funciones con mayúscula. La Class constructora.
    // Sino, se puede utilizar los types definidos por Mongoose que se importan como SchemaTypes.
    // El SchemaTypes tiene más tipos que los de JS standard.
    type: String,
    // Le puedo dar validación. Ex.: requerido.
    required: true,
    unique: true,
  },

  interestingScore: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },

  importantScore: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },

  owner: {
    type: Schema.Types.ObjectId,
    // La "ref" toma un string.
    // Hay que ponerle el nombre que está definido en el "model" del User:
    ref: 'User',
    // Otra opción:
    // type: Schema.Types.ObjectId
  },
});

// Para setear métodos específicos de Schema: .set
thingSchema.set('toJSON', {
  // Para las salidas del tipo JSON queremos transformar:
  transform(_document, returnedObject) {
    // Que el "_id" de Mongo se transforme en ".id"
    returnedObject.id = returnedObject._id;
    // No queremos que devuelva el "__v" de la versión.
    delete returnedObject.__v;
    // No queremos que quede el "_id" (ya transformado arriba como ".id")
    delete returnedObject._id;
    // Eliminamos la línea de password para no enviar esa información. MUY importante.
    // En este caso como no hay password lo dejamos comentado:
    // delete returnedObject.password;
  },
});

// Exportación de Model. Se escribe con mayúscula.
// model --> Función que se ejecuta y devuelve un Object de tipo Model.
// Pide primero nombre del modelo. Mongoose crea una colección con el nombre dado en minúscula y plural.
// Segundo pide el Schema a utilizar para completar la colección.
// Opcionalmente se le puede dar el nombre de la base de datos. Si no se lo ponemos es cuando hace minúscula y plural del primer parámetro.
export const ThingModel = model('Thing', thingSchema, 'things');
