import { Injectable, NestMiddleware } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { ForbiddenErrorException, UnAuthorizedErrorException } from '../filters';

dotenv.config();

interface CustomRequest extends Request {
  user?: { id: string };
}

export const verifyTokens = ({ secret, token }: { secret: string; token: string }) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, function (err: Error, decoded: any) {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

@Injectable()
export class AuthenticateUserMiddleware implements NestMiddleware {
  use(req: CustomRequest, res: Response, next: NextFunction) {
    const token = req.cookies.Authentication as string;
    verifyTokens({
      token,
      secret: 'secret',
    })
      .then((decoded) => {
        const user = {
          id: decoded['id'],
        };
        req.user = user;
        next();
      })
      .catch(() => {
        res
          .status(401)
          .json(
            new ForbiddenErrorException(
              'Your access token is either expired or invalid',
            ).getResponse(),
          );
      });
  }
}
