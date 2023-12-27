// upload.handler.ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as util from 'util';

const upload: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body);
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

export const handler = upload;
