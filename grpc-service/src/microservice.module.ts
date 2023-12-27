import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'HELLO_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'hello',
          protoPath: 'src/protos/hello.proto',
        },
      },
    ]),
  ],
  controllers: [],
  providers: [AppService],
})
export class MicroserviceModule {}
