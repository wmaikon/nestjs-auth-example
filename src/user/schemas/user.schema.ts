import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Config } from '../../config';
import { RoleAsArray } from '../../common/roles/user.role';

export const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true},
  password: { type: String, required: true, select: false },
  created_at: { type: Date, default: Date.now()},
  roles: [{ type: String, required: true, enum: RoleAsArray }]
});

UserSchema.pre('save', function(next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    next();
  } else {
    // turn plaintext password into hashed password
    const salt = bcrypt.genSaltSync(Config.db.bcrypt.rounds);
    user.password = bcrypt.hashSync(user.password, salt);
    next();
  }
});

// do not return certain fields when saving the document
UserSchema.set("toJSON", {
  transform: function(doc, ret, options) {
    delete ret.password;
    return ret;
  }
});
