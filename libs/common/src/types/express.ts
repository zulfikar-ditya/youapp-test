// import { UserInformation } from '@app/repositories';

declare module 'express' {
  interface Request {
    user?: {};
  }
}

export {};
