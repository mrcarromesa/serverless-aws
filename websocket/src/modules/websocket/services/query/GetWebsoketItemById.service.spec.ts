import FakeWebsocketRepository from '@modules/websocket/repositories/fakes/FakeWebsocketRepository';

import GetWebsoketItemByIdService from './GetWebsoketItemById.service';

let fakeWebsocketRepository: FakeWebsocketRepository;

describe('GetWebsoketItemByIdService', () => {
  beforeEach(() => {
    fakeWebsocketRepository = new FakeWebsocketRepository();
  });

  it('shold be able to get websocket', async () => {
    await fakeWebsocketRepository.create({
      id: '1',
      msg: 'connectHandler',
    });

    const service = new GetWebsoketItemByIdService(fakeWebsocketRepository);
    const result = await service.execute('1');
    expect(result).toEqual(
      expect.objectContaining({
        id: '1',
      }),
    );
  });
});
