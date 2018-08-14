# nestjs-auth-example

## Description

Example authentication using refresh and access tokens.
It uses MongoDB for storing refresh tokens and stores user passwords using bcrypt.
It has simple user roles.

## Requirements

A running MongoDB server.

## Installation

```bash
$ npm install
```

## Create RSA certificates

```bash
$ #!/bin/bash
$ openssl genrsa -out key.pem 2048
$ openssl rsa -in key.pem -outform PEM -pubout -out public.pem
```

Move key.pem and public.pem to ./src/common/constants/

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

