export const AuthConstants = {
  cert: {
    privateKey: './key.pem',
    publicKey: './public.pem'
  },
  access_token: {
    options: {
      algorithm: 'RS256',
      expiresIn: '15min',
      issuer: 'nestjs-auth-example'
    }
  },
  refresh_token: {
    length: 64,
    expiresIn: '30 days'
  }
}
