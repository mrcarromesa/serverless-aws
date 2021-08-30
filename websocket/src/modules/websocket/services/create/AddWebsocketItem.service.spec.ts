import FakeWebsocketRepository from '@modules/websocket/repositories/fakes/FakeWebsocketRepository';

import AddWebsocketItemService from './AddWebsocketItem.service';

let fakeWebsocketRepository: FakeWebsocketRepository;

describe('AddWebsocketItemService', () => {
  beforeEach(() => {
    fakeWebsocketRepository = new FakeWebsocketRepository();
  });

  it('shold be able to add a new websocket', async () => {
    const websocketBefore = await fakeWebsocketRepository.findId('1');
    expect(websocketBefore).toEqual({});
    const service = new AddWebsocketItemService(fakeWebsocketRepository);
    const result = await service.execute({
      id: '1',
      msg: 'connectHandler',
    });

    const websocketAfter = await fakeWebsocketRepository.findId('1');
    expect(websocketAfter).toEqual(
      expect.objectContaining({
        msg: 'connectHandler',
      }),
    );
    expect(result).toEqual(
      expect.objectContaining({
        msg: 'connectHandler',
      }),
    );
  });
});
