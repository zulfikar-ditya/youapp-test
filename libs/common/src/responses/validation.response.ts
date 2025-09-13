import { HttpException } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validationResponse = (error: any) => {
  const response = {
    code: 422,
    success: false,
    message: 'Unprocessable Entity',

    errors: error,
  };

  return new HttpException(response, 422);
};
