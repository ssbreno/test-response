import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, lastValueFrom, map } from 'rxjs';
import * as FormData from 'form-data';

interface FileUploadGrpcService {
  uploadFile(request: { data: any; metadata: any }): Observable<any>;
}

@Injectable()
export class AppService implements OnModuleInit {
  private fileUploadService: any;
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
      const formData = new FormData();
      formData.append('file', file.buffer, file.originalname);
      const response = await lastValueFrom(
        this.httpService
          .post(baseUrl, formData, {
            headers: formData.getHeaders(),
          })
          .pipe(map((response: any) => response.data)),
      );

      return response;
    } catch (e) {
      const errorMessage = e?.response?.data?.message || e.message;
      throw new Error(errorMessage);
    }
  }

  async uploadFileWithGrpc(file: any, metadata: any): Promise<any> {
    const request = { data: file, metadata };
    return await lastValueFrom(this.fileUploadService.uploadFile(request));
  }

  async uploadFileWithServerless(file: any): Promise<any> {
    try {
      const baseUrl = `${process.env.SLS_URL}`;
      const response = await lastValueFrom(
        this.httpService
          .post(baseUrl, file, {
            headers: { 'Content-Type': 'application/json' },
          })
          .pipe(map((response: any) => response.data)),
      );

      return response;
    } catch (e) {
      const errorMessage = e?.response?.data?.message || e.message;
      throw new Error(errorMessage);
    }
  }
}
