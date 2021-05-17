import FakeTaskRepository from '@modules/task/repositories/fakes/FakeTaskRepository';

import DeleteTaskService from './DeleteTask.service';

let fakeTaskRepository: FakeTaskRepository;

describe('DeleteTask', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fakeTaskRepository = new FakeTaskRepository();
  });

  it('shold be able to remove task', async () => {
    await fakeTaskRepository.create({
      id: 'uuid',
      category: 'Category',
      created_by_user_id: 'old_user',
      designated_to_user_id: 'old_user',
      title: 'Task Example',
    });
    const taskBeforeDelete = await fakeTaskRepository.findTaskByKeys({
      category: 'Category',
      id: 'uuid',
    });
    const service = new DeleteTaskService(fakeTaskRepository);
    await service.execute({
      category: 'Category',
      id: 'uuid',
    });

    const taskAfterDelete = await fakeTaskRepository.findTaskByKeys({
      category: 'Category',
      id: 'uuid',
    });

    expect(taskBeforeDelete).toEqual(
      expect.objectContaining({
        title: 'Task Example',
      }),
    );

    expect(taskAfterDelete).toBeUndefined();
  });
});
