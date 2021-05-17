import FakeTaskRepository from '@modules/task/repositories/fakes/FakeTaskRepository';

import AddTaskService from './AddTask.service';

let fakeTaskRepository: FakeTaskRepository;

describe('AddTask', () => {
  beforeEach(() => {
    fakeTaskRepository = new FakeTaskRepository();
  });

  it('shold be able to add a new task', async () => {
    const service = new AddTaskService(fakeTaskRepository);
    const result = await service.execute({
      category: 'Category',
      created_by_user_id: 'user',
      designated_to_user_id: 'user',
      title: 'Task Example',
      description: 'Description from task',
      attachments: [],
    });

    expect(result).toEqual(
      expect.objectContaining({
        title: 'Task Example',
      }),
    );
  });

  it('shold be able to add a new task some when not inform same props ', async () => {
    const service = new AddTaskService(fakeTaskRepository);
    const result = await service.execute({
      category: 'Category',
      created_by_user_id: 'user',
      designated_to_user_id: 'user',
      title: 'Task Example',
    });

    expect(result).toEqual(
      expect.objectContaining({
        title: 'Task Example',
      }),
    );
  });
});
