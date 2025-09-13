// import { UserInformation } from '@app/repositories';

import { UserInformation } from '@repositories/repositories';

declare module 'express' {
  interface Request {
    user?: UserInformation;
  }
}

export {};
