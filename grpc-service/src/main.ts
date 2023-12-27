import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { MicroserviceModule } from './microservice.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyMultipart from '@fastify/multipart';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    MicroserviceModule,
    new FastifyAdapter(),
  );

  await app.register(fastifyMultipart);

  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: 'upload',
      protoPath: 'src/protos/upload.proto',
    },
  });

  await app.startAllMicroservices();
  await app.listen(3002);
}
bootstrap();
