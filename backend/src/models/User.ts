import mongoose, { Schema } from 'mongoose';
import type { IUser, IUserDB } from '../../../shared/modelTypes';

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isDefaultPassword: { type: Boolean, default: true },
});

export default mongoose.model<IUser>('User', UserSchema);

