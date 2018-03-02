export const Config = {
  network: {
    port: 3000
  },
  db: {
    uri: 'mongodb://localhost/nestjs-auth-example',
    bcrypt: {
      rounds: 10
    }
  },
  auth: {
    cert: {
      privPath: 'protected/key.pem',
      pubPath: 'protected/public.pem'
    },
    tokenOptions: {
      algorithm: 'RS256',
      expiresIn: '2 days',
      jwtid: 'Nestjs-auth-example'
    }
  }
}
