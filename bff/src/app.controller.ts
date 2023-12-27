import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FastifyFileInterceptor } from './fastify-file-interceptor';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('rest')
  @UseInterceptors(FastifyFileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any): Promise<any> {
    const filePath = await this.appService.uploadFileWithRest(file);
    return filePath;
  }

  @Post('sls')
  async uploadFileSLS(@Body() file: any): Promise<any> {
    const filePath = await this.appService.uploadFileWithServerless(file);
    return filePath;
  }
}
