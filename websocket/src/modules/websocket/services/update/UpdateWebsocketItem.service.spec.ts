import FakeWebsocketRepository from '@modules/websocket/repositories/fakes/FakeWebsocketRepository';

import UpdateWebsocketItemService from './UpdateWebsocketItem.service';

let fakeWebsocketRepository: FakeWebsocketRepository;

describe('UpdateWebsocketItemService', () => {
  beforeEach(() => {
    fakeWebsocketRepository = new FakeWebsocketRepository();
  });

  it('shold be able to update a websocket', async () => {
    const websocketBefore = await fakeWebsocketRepository.create({
      id: '1',
      msg: 'connectHandler',
    });
    expect(websocketBefore).toEqual(
      expect.objectContaining({
        msg: 'connectHandler',
      }),
    );

    const service = new UpdateWebsocketItemService(fakeWebsocketRepository);
    await service.execute({
      id: '1',
      msg: 'connectHandler1',
    });

    const websocketAfter = await fakeWebsocketRepository.findId('1');
    expect(websocketAfter).toEqual(
      expect.objectContaining({
        msg: 'connectHandler1',
      }),
    );
  });
});
