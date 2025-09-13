import { NestFactory } from '@nestjs/core';
import { MobileApisModule } from './mobile-apis.module';
import { CustomValidationPipe } from '@app/common';
import { VersioningType } from '@nestjs/common';
import { LoggerUtils } from '@utils/utils';

async function bootstrap() {
  const app = await NestFactory.create(MobileApisModule);
  app.useGlobalPipes(new CustomValidationPipe());

  const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGINS?.split(',') ?? [
    'http://localhost:3000',
  ];
  const ALLOWED_METHODS = process.env.ALLOWED_METHODS?.split(',') ?? [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'OPTIONS',
  ];
  const ALLOWED_HEADERS = process.env.ALLOWED_HEADERS?.split(',') ?? [
    'Content-Type',
    'Authorization',
  ];

  app.enableCors({
    origin: ALLOWED_ORIGIN,
    methods: ALLOWED_METHODS,
    allowedHeaders: ALLOWED_HEADERS,
    maxAge: 0,
    credentials: false,
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(process.env.APP_MOBILE_PORT ?? 8002);

  LoggerUtils.info(`Application is running on: ${await app.getUrl()}`);
}
bootstrap().catch((err) => {
  LoggerUtils.error('Error starting application', err);
  process.exit(1);
});
