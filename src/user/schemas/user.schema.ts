import { hash as bcryptHash } from 'bcrypt';
import { Schema } from 'mongoose';
import { DatabaseConstants } from '@constants/database.constants';
import { UserRoleEnumAsArray } from '@token/enums/user-role.enum';

export const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true, select: false },
  created_at: { type: Date, default: Date.now() },
  roles: [{ type: String, required: true, enum: UserRoleEnumAsArray }]
}, {
  // do not return certain fields when saving the document
  toObject: {
    transform: (doc, ret, options) => {
      delete ret.password;
      return ret;
    }
  },
  toJSON: {
    transform: (doc, ret, options) => {
      delete ret.password;
      return ret;
    }
  }
});

// when saving the password field, hash it again
UserSchema.pre('save', async function() {
  const user = this;
  if (user.isModified('password')) {
    await bcryptHash(user.get('password'), DatabaseConstants.bcrypt.rounds).then(function(hash) {
      user.set('password', hash);
    });
  }
});
