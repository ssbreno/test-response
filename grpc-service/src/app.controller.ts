import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FastifyFileInterceptor } from './fastify-file-interceptor';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @UseInterceptors(FastifyFileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any, @Req() req): Promise<any> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    const metadata = { fileName: file.originalname, ...req.body };
    const response = await this.appService.uploadFile(file, metadata);
    return response;
  }
}
