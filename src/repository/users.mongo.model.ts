import { model, Schema } from 'mongoose';
import { UserStructure } from '../entities/user.model';

const userSchema = new Schema<UserStructure>({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
});

userSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
    // CLAVE no olvidar hacer el delete del password:
    delete returnedObject.password;
  },
});

export const UserModel = model('User', userSchema, 'users');
