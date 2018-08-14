import * as mongoose from 'mongoose';
import { Mockgoose } from 'mockgoose';
import { DatabaseConstants } from '@constants/database.constants';

export const databaseProviders = [
  {
    provide: 'DbConnectionToken',
    useFactory: async () => {
      (mongoose as any).Promise = global.Promise;

      if (process.env.NODE_ENV === 'test') {
        const mockgoose = new Mockgoose(mongoose);
        mockgoose.helper.setDbVersion('3.6.3');
        await mockgoose.prepareStorage();
        await mongoose.connect('mongodb://nonexisting.local/testdb', { useNewUrlParser: true });
      } else {
        await mongoose.connect(DatabaseConstants.uri, { useNewUrlParser: true });
      }
      return mongoose;
    }
  },
];
