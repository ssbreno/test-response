import { Injectable, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import * as pidusage from 'pidusage';
import * as fs from 'fs-extra';
import * as path from 'path';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  @GrpcMethod('FileUpload', 'UploadFile')
  async uploadFile(data: IterableIterator<any>, metadata: any): Promise<any> {
    const fileName = metadata.fileName || 'defaultFileName';
    const filePath = path.join('uploads', fileName);
    const writeStream = fs.createWriteStream(filePath);

    try {
      for await (const chunk of data) {
        this.logger.debug(`Received chunk of size: ${chunk.data.length}`);
        writeStream.write(chunk.data);
      }
      const stats = await pidusage(process.pid);
      this.logger.debug(`Memory Usage (MB): ${stats.memory / 1024 / 1024}`);
      this.logger.debug(`CPU Usage (%): ${stats.cpu}`);
      writeStream.end();
      return { message: 'File uploaded successfully' };
    } catch (error) {
      this.logger.error('Error during file upload:', error);
      throw error;
    } finally {
      writeStream.close();
    }
  }

  @GrpcMethod('HelloService', 'SayHello')
  sayHello(data: any): { message: string } {
    return { message: 'Hello, World!' };
  }
}
