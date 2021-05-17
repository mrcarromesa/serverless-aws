import FakeTaskRepository from '@modules/task/repositories/fakes/FakeTaskRepository';

import BatchDeleteTasksService from './BatchDeleteTasks.service';

let fakeTaskRepository: FakeTaskRepository;

describe('BatchDeleteTasks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fakeTaskRepository = new FakeTaskRepository();
  });

  it('shold be able to remove tasks', async () => {
    await fakeTaskRepository.create({
      id: 'uuid',
      category: 'Category',
      created_by_user_id: 'old_user',
      designated_to_user_id: 'old_user',
      title: 'Task Example',
    });
    await fakeTaskRepository.create({
      id: 'uuid1',
      category: 'Category',
      created_by_user_id: 'old_user',
      designated_to_user_id: 'old_user',
      title: 'Task Example',
    });

    const tasksBeforeDelete = await fakeTaskRepository.findAllTasksPaginated({
      limit: 100,
    });

    const service = new BatchDeleteTasksService(fakeTaskRepository);
    await service.execute([
      {
        category: 'Category',
        id: 'uuid',
      },
    ]);

    expect(tasksBeforeDelete.count).toEqual(2);
    const tasksAfterDelete = await fakeTaskRepository.findAllTasksPaginated({
      limit: 100,
    });
    expect(tasksAfterDelete.count).toEqual(1);
  });
});
