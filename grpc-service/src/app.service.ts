import { Injectable, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import * as pidusage from 'pidusage';
import * as fs from 'fs-extra';
import * as path from 'path';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  @GrpcMethod('FileUpload', 'UploadFile')
  async uploadFile(data, metadata): Promise<any> {
    const fileName = metadata.fileName;
    const filePath = path.join('uploads', fileName);
    const stats = await pidusage(process.pid);
    const writeStream = fs.createWriteStream(filePath);
    this.logger.log(`Memory Usage (MB): ${stats.memory / 1024 / 1024}`);
    this.logger.log(`CPU Usage (%): ${stats.cpu}`);
    for await (const chunk of data) {
      this.logger.log(`Received chunk of size: ${chunk.data.length}`);
      writeStream.write(chunk.data);
    }
    writeStream.end();
    return { message: 'File uploaded successfully' };
  }
}
