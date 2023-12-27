import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  mixin,
  NestInterceptor,
  Optional,
  Type,
} from '@nestjs/common';
import FastifyMulter from 'fastify-multer';
import { Multer, Options } from 'multer';
import { Observable } from 'rxjs';

const multerErrorDict = {
  LIMIT_FILE_SIZE: 'Tamanho do arquivo excede o limite permitido.',
  LIMIT_PART_COUNT: 'Número de partes excede o limite permitido.',
  LIMIT_FILE_COUNT: 'Número de arquivos excede o limite permitido.',
  LIMIT_FIELD_KEY: 'Tamanho da chave do campo excede o limite permitido.',
  LIMIT_FIELD_VALUE: 'Tamanho do valor do campo excede o limite permitido.',
  LIMIT_FIELD_COUNT: 'Número de campos excede o limite permitido.',
  LIMIT_UNEXPECTED_FILE: 'Campo inesperado encontrado.',
  INVALID_FILE_TYPE: 'Tipo de arquivo não permitido.',
  INVALID_PART: 'Parte do arquivo inválida encontrada.',
  INVALID_FIELD_NAME: 'Nome do campo inválido.',
  UNEXPECTED_FIELD: 'Campo inesperado encontrado.',
  MISSING_FILE: 'Arquivo ausente.',
  MAX_KEY: 'Chave do campo atingiu o tamanho máximo.',
  LIMIT_VALUE: 'Valor do campo excede o limite permitido.',
  LIMIT_COUNT: 'Número total de campos excede o limite permitido.',
};

type MulterInstance = any;
export function FastifyFileInterceptor(
  fieldName: string,
  localOptions?: Options,
): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    protected multer: MulterInstance;

    constructor(
      @Optional()
      @Inject('MULTER_MODULE_OPTIONS')
      options: Multer,
    ) {
      this.multer = (FastifyMulter as any)({ ...options, ...localOptions });
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const ctx = context.switchToHttp();

      await new Promise<void>((resolve, reject) =>
        this.multer.single(fieldName)(
          ctx.getRequest(),
          ctx.getResponse(),
          (error: any) => {
            if (error) {
              // const error = transformException(err);
              const message = multerErrorDict[error?.code] || null;
              if (message) {
                return reject(
                  new HttpException(message, HttpStatus.BAD_REQUEST),
                );
              }
              return reject(error);
            }
            resolve();
          },
        ),
      );

      return next.handle();
    }
  }
  const Interceptor = mixin(MixinInterceptor);
  return Interceptor as Type<NestInterceptor>;
}
