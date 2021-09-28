import FakeTaskRepository from '@modules/task/repositories/fakes/FakeTaskRepository';

import UpdateDeliveryTaskService from './UpdateDeliveryTask.service';

let fakeTaskRepository: FakeTaskRepository;

describe('UpdateDeliveryTaskService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fakeTaskRepository = new FakeTaskRepository();
  });

  it('shold be able to update a task', async () => {
    await fakeTaskRepository.create({
      id: 'uuid',
      category: 'Category',
      created_by_user_id: 'old_user',
      designated_to_user_id: 'old_user',
      title: 'old Title',
    });
    const service = new UpdateDeliveryTaskService(fakeTaskRepository);
    const result = await service.execute({
      id: 'uuid',
      category: 'Category',
      user_delivered: 'user_id',
      delivery_date: new Date(),
    });

    expect(result).toEqual(
      expect.objectContaining({
        user_delivered: 'user_id',
      }),
    );
  });
});
