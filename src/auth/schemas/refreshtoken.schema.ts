import { Schema } from 'mongoose';
import { AuthConstants } from '@constants/auth.constants';

export const RefreshTokenSchema = new Schema({
  refresh_token: { type: String, required: true },
  email: { type: String, required: true },
  iat: { type: Date, expires: AuthConstants.refresh_token.expiresIn, default: Date.now }
});

RefreshTokenSchema.pre("save", function(next) {
  this.set('iat', new Date()); // reset expire time when saving a document
  next();
});
// https://stackoverflow.com/questions/24008956/time-to-live-in-mongodb-mongoose-dont-work-documents-doesnt-get-deleted
