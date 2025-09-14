import mongoose, { Document, Schema } from 'mongoose';

export interface IProvider {
  provider: string;
  providerId: string;
}

export interface IUser extends Document {
  _id: string;
  email: string;
  name: string;
  picture?: string;
  providers: IProvider[];
  createdAt: Date;
  updatedAt: Date;
}

const providerSchema = new Schema<IProvider>({
  provider: { type: String, required: true },
  providerId: { type: String, required: true }
});

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  picture: {
    type: String,
    default: null
  },
  providers: {
    type: [providerSchema],
    required: true,
    default: []
  }
}, {
  timestamps: true
});

// Create index - only once
userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;