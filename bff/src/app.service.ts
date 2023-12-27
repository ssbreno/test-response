import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, lastValueFrom, map } from 'rxjs';

interface FileUploadGrpcService {
  uploadFile(request: { data: any; metadata: any }): Observable<any>;
}

@Injectable()
export class AppService {
  private fileUploadService: FileUploadGrpcService;
  constructor(
    private httpService: HttpService,
    @Inject('GRPC_CLIENT') private client: ClientGrpc,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  onModuleInit() {
    this.fileUploadService =
      this.client.getService<FileUploadGrpcService>('FileUpload');
  }

  async uploadFileWithRest(file: any): Promise<any> {
    try {
      const baseUrl = `${process.env.REST_URL}`;
      return await lastValueFrom(
        this.httpService.post(baseUrl, file, null).pipe(
          map((response: any) => {
            return response.data;
          }),
        ),
      );
    } catch (e) {
      throw e.response.data.message;
    }
  }

  async uploadFileWithGrpc(file: any, metadata: any): Promise<any> {
    const request = { data: file, metadata };
    return await lastValueFrom(this.fileUploadService.uploadFile(request));
  }

  async uploadFileWithServerless(file: any) {
    try {
      const baseUrl = `${process.env.SLS_URL}`;
      return await lastValueFrom(
        this.httpService.post(baseUrl, file, null).pipe(
          map((response: any) => {
            return response.data;
          }),
        ),
      );
    } catch (e) {
      throw e.response.data.message;
    }
  }
}
