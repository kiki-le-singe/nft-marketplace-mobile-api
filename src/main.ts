import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // https://docs.nestjs.com/security/cors
  app.enableCors();
  app.setGlobalPrefix('api');

  // https://docs.nestjs.com/security/helmet
  app.use(helmet());

  await app.listen(3002);
  console.log(
    `Application is running on: \x1b[33m${await app.getUrl()}\x1b[0m`,
  );
}
bootstrap();
