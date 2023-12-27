import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as pidusage from 'pidusage';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    return 'Hello World!';
  }

  async saveFile(file: any): Promise<string> {
    try {
      const uploadDir = path.join(__dirname, '..', 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });
      const uniqueFileName = `${Date.now()}-${file.originalname}`;
      const filePath = path.join(uploadDir, uniqueFileName);
      await fs.writeFile(filePath, file.buffer);
      const stats = await pidusage(process.pid);
      this.logger.log(`Memory Usage (MB): ${stats.memory / 1024 / 1024}`);
      this.logger.log(`CPU Usage (%): ${stats.cpu}`);
      return filePath;
    } catch (error) {
      throw new Error('Failed to save the file');
    }
  }

}
