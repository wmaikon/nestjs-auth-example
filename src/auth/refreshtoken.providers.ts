import { RefreshTokenSchema } from './schemas/refreshtoken.schema';

export const refreshTokenProviders = [
  {
    provide: 'RefreshTokenModelToken',
    useFactory: (mongoose) => mongoose.connection.model('RefreshToken', RefreshTokenSchema),
    inject: ['DbConnectionToken'],
  }
];
