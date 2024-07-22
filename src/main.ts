import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  await app.listen(3002);
  console.log(
    `Application is running on: \x1b[33m${await app.getUrl()}\x1b[0m`,
  );
}
bootstrap();
