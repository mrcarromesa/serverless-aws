import { account, SQS } from '@config/aws';
// import { logger } from '@config/logger';
import { SendMessageRequest, SendMessageResult } from 'aws-sdk/clients/sqs';

interface IPayloadQueue<T> {
  queue_name: string;
  delay_seconds?: number;
  payload: T;
  local_port?: number;
}

class SendMessageToQueue {
  async execute<T>({
    queue_name,
    payload,
    delay_seconds,
    local_port = 9324,
  }: IPayloadQueue<T>): Promise<SendMessageResult> {
    const { Account } = await account.promise();

    const queueURLBase =
      process.env.STAGE === 'local'
        ? `http://0.0.0.0:${local_port}/queue`
        : `https://sqs.us-east-1.amazonaws.com/${Account}`;
    const queueURL = `${queueURLBase}/${queue_name}`;

    const params: SendMessageRequest = {
      MessageBody: JSON.stringify(payload),
      MessageAttributes: {
        queue_details: {
          DataType: 'String',
          StringValue: `queue_name: ${queue_name}`,
        },
      },
      QueueUrl: queueURL,
      DelaySeconds: delay_seconds,
    };

    // logger('SendMessageToQueue-info', {
    //   MessageBody: JSON.stringify(payload),
    //   QueueUrl: queueURL,
    //   DelaySeconds: delay_seconds,
    // });

    return SQS.sendMessage(params).promise();
  }
}

export default new SendMessageToQueue();
