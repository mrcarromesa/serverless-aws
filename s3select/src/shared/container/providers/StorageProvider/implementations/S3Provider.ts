import { S3 } from '@config/aws';
import { StreamingEventStream } from 'aws-sdk/lib/event-stream/event-stream';
// import { addHours } from 'date-fns';
import zlib from 'zlib';

import IRemoveFileParamsDTO from '../dtos/IRemoveFileParamsDTO';
import ISaveFileContentParamsDTO from '../dtos/ISaveFileContentParamsDTO';
import ISelectFileContentParamsDTO from '../dtos/ISelectFileContentParamsDTO';
import IStorageProvider from '../models/IStorageProvider';

export default class S3Provider implements IStorageProvider {
  public async removeFile({
    bucket,
    file_path,
  }: IRemoveFileParamsDTO): Promise<void> {
    await S3.deleteObject({
      Bucket: bucket,
      Key: file_path,
    }).promise();
  }

  public async saveTextToS3InGzip({
    bucket,
    key,
    body,
    content_type = 'application/octet-stream',
  }: ISaveFileContentParamsDTO): Promise<void> {
    const gzip = zlib.gzipSync(Buffer.from(body, 'base64'));

    const bodyGzip64 = gzip.toString('base64');

    await S3.putObject({
      Bucket: bucket,
      Key: key,
      Body: Buffer.from(bodyGzip64, 'base64'),
      ContentType: content_type,
      // Expires: addHours(new Date(), 1),
    }).promise();
  }

  public async selectFileContent<T>({
    bucket,
    file_path,
    query,
  }: ISelectFileContentParamsDTO): Promise<T[]> {
    let records: T[] = [];
    if (bucket && query) {
      const result = await S3.selectObjectContent({
        Bucket: bucket,
        Key: file_path,
        ExpressionType: 'SQL',
        Expression: query,
        InputSerialization: {
          JSON: {
            Type: 'DOCUMENT',
          },
          CompressionType: 'GZIP',
        },
        OutputSerialization: {
          JSON: {
            RecordDelimiter: ',',
          },
        },
      }).promise();

      if (result && result.Payload) {
        const eventPayload = result.Payload as StreamingEventStream<
          Record<string, Record<string, unknown>>
        >;
        records = await new Promise(resolve => {
          eventPayload.on('data', event => {
            if (event.Records) {
              records.push(event.Records.Payload as T);
            }
          });
          eventPayload.on('end', () => {
            let recordsString = Buffer.concat(
              records as unknown as Uint8Array[],
            ).toString('utf8');
            recordsString = recordsString.replace(/,$/, '');
            recordsString = `[${recordsString}]`;
            records = JSON.parse(recordsString);
            resolve(records);
          });
        });
      }
    }

    return records;
  }
}
