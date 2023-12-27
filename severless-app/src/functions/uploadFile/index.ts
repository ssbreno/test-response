import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.upload`,
  events: [
    {
      http: {
        method: 'post',
        path: 'upload',
      },
    },
  ],
};
