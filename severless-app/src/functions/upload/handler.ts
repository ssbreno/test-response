import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as util from 'util';
import { middyfy } from '../../libs/lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway';
import schema from './schema';

const upload: ValidatedEventAPIGatewayProxyEvent<typeof schema>  = async (event) => {
  try {
    const body = event.body;
    const buffer = Buffer.from(body.file, 'base64');
    const fileName = body.fileName || 'defaultFileName';

    const filePath = path.join('/tmp', fileName);
    await util.promisify(fs.writeFile)(filePath, buffer);

    const memoryUsage = process.memoryUsage();
    const cpus = os.cpus();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'File uploaded successfully',
        memoryUsage,
        cpuInfo: cpus.length,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'File upload failed' }),
    };
  }
};

export const main = middyfy(upload);
