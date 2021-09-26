import { lambdaConfig } from '@config/aws';

import GetMsgFromClientService from './GetMsgFromClient.service';

describe('GetMsgFromClientService', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  it('should be able to call lambda function', async () => {
    jest.spyOn(lambdaConfig, 'invoke').mockImplementationOnce(() => {
      return {
        promise: () =>
          Promise.resolve({
            Payload: JSON.stringify({
              body: JSON.stringify({ msg: 'result' }),
            }),
          }),
      } as never;
    });

    const getMsgFromClientService = new GetMsgFromClientService();
    const result = await getMsgFromClientService.execute('msg');
    expect(result).toEqual(expect.objectContaining({ msg: 'result' }));
  });
});
