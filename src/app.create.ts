import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

export function appCreate(app: INestApplication): void {
  /*
   * Use validation pipes globaly
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  /*
   * Install Swagger
   * npm i @nestjs/swagger@7.3.0
   */

  //create the swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nestjs API Documentation')
    .setDescription('Use the base API URL as http://localhost:3005')
    .setTermsOfService('http://localhost:3005/terms-of-service')
    .setLicense(
      'MIT License',
      'https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt',
    )
    .addServer('http://localhost:3005/')
    .setVersion('1.0')
    .build();
  //instantiate swagger
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  //Setup the aws sdk used uploading the files to aws s3 bucket
  const configService = app.get(ConfigService);
  config.update({
    credentials: {
      accessKeyId: configService.get('appConfig.awsAccessKeyId'),
      secretAccessKey: configService.get('appConfig.awsSecretKey'),
    },
    region: configService.get('appConfig.awsRegion'),
  });

  //enable cross
  app.enableCors();
  //Add Global Interceptor
  // app.useGlobalInterceptors(new DataResponseInterceptor());
}
