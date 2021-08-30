import FakeWebsocketRepository from '@modules/websocket/repositories/fakes/FakeWebsocketRepository';

import ListWebsocketItemsService from './ListWebsocketItems.service';

let fakeWebsocketRepository: FakeWebsocketRepository;

describe('ListWebsocketItemsService', () => {
  beforeEach(() => {
    fakeWebsocketRepository = new FakeWebsocketRepository();
  });

  it('shold be able to list websockets', async () => {
    await fakeWebsocketRepository.create({
      id: '1',
      msg: 'connectHandler',
    });
    await fakeWebsocketRepository.create({
      id: '2',
      msg: 'connectHandler',
    });

    const service = new ListWebsocketItemsService(fakeWebsocketRepository);
    const result = await service.execute('1');
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: '2',
        }),
      ]),
    );

    expect(result).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: '1',
        }),
      ]),
    );
  });
});
