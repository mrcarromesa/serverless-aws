import { S3 } from '@config/aws';
import { StreamingEventStream } from 'aws-sdk/lib/event-stream/event-stream';

import ISelectFileContentParamsDTO from '../dtos/ISelectFileContentParamsDTO';
import IStorageProvider from '../models/IStorageProvider';

export default class S3Provider implements IStorageProvider {
  async selectFileContent<T>({
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
              (records as unknown) as Uint8Array[],
            ).toString('utf8');
            recordsString = recordsString.replace(/,$/, '');
            recordsString = `[${recordsString}]`;
            records = JSON.parse(recordsString);
            resolve(records);
          });
        });

        // records = lodash.uniqBy(records, 'employee_cpf');
      }
    }

    return records;
  }
}
