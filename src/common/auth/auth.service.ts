import { Component } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { Config } from '../../config';
import { Token } from './token.interface';

@Component()
export class AuthService {

  private mPrivKey: Buffer;
  private mPubKey: Buffer;

  constructor() {
    try {
      this.mPrivKey = fs.readFileSync(Config.auth.cert.privPath);
      this.mPubKey = fs.readFileSync(Config.auth.cert.pubPath);
    } catch (err) {
      throw new Error('Certificate files do not exist or are not readable!');
    }
  }

  public sign(payload: object): string {
    return jwt.sign(payload, this.mPrivKey, Config.auth.tokenOptions);
  }

  public verify(token: string): Token {
    return jwt.verify(token, this.mPubKey) as Token;
  }

}
