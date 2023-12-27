import { Controller, Get, Post, Req, UploadedFile } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('rest')
  async uploadFile(@UploadedFile() file: any): Promise<any> {
    const filePath = await this.appService.uploadFileWithRest(file);
    return filePath;
  }

  @Post('grpc')
  async uploadFileGrpc(@UploadedFile() file: any, @Req() req): Promise<any> {
    const filePath = await this.appService.uploadFileWithGrpc(file, req);
    return filePath;
  }

  @Post('sls')
  async uploadFileSLS(@UploadedFile() file: any): Promise<any> {
    const filePath = await this.appService.uploadFileWithServerless(file);
    return filePath;
  }
}
