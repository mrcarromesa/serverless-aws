import { lambdaConfig } from '@config/aws';
import { injectable } from 'tsyringe';

@injectable()
export default class GetMsgFromClientService {
  async execute(msg: string): Promise<unknown> {
    const lambdaInvoke = await lambdaConfig
      .invoke({
        FunctionName: process.env.FUNCTION_INVOKE_NAME || '',
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify(msg),
      })
      .promise();

    const result = JSON.parse(String(lambdaInvoke.Payload));
    return JSON.parse(result.body);
  }
}
