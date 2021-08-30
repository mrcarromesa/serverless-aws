import FakeWebsocketRepository from '@modules/websocket/repositories/fakes/FakeWebsocketRepository';

import RemoveWebsocketItemService from './RemoveWebsocketItem.service';

let fakeWebsocketRepository: FakeWebsocketRepository;

describe('RemoveWebsocketItemService', () => {
  beforeEach(() => {
    fakeWebsocketRepository = new FakeWebsocketRepository();
  });

  it('shold be able to remove a websocket', async () => {
    const websocketBefore = await fakeWebsocketRepository.create({
      id: '1',
      msg: 'connectHandler',
    });
    expect(websocketBefore).toEqual(
      expect.objectContaining({
        msg: 'connectHandler',
      }),
    );

    const service = new RemoveWebsocketItemService(fakeWebsocketRepository);
    await service.execute('1');

    const websocketAfter = await fakeWebsocketRepository.findId('1');
    expect(websocketAfter).toEqual({});
  });
});
