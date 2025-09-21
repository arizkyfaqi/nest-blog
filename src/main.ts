import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appCreate } from './app.create';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //add middleware
  appCreate(app);

  const port = 3005;
  //running
  await app.listen(port);
  //server info on running
  console.info(`Running on port ${port}`);
}
bootstrap();
