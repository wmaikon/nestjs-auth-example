import { Document } from 'mongoose';

export interface RefreshToken extends Document {
  readonly refresh_token: string;
  readonly email: string;
  readonly iat: Date;
}
