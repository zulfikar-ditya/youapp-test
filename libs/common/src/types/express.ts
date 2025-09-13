// import { UserInformation } from '@app/repositories';

import { AdminInformation, UserInformation } from '@repositories/repositories';

declare module 'express' {
  interface Request {
    user?: UserInformation;
    admin?: AdminInformation;
  }
}

export {};
