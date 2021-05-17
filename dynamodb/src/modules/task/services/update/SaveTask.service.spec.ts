import FakeTaskRepository from '@modules/task/repositories/fakes/FakeTaskRepository';

import SaveTaskService from './SaveTask.service';

let fakeTaskRepository: FakeTaskRepository;

describe('SaveTask', () => {
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
    const service = new SaveTaskService(fakeTaskRepository);
    const result = await service.execute({
      id: 'uuid',
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

  it('shold be able to update a task some when not inform same props ', async () => {
    await fakeTaskRepository.create({
      id: 'uuid',
      category: 'Category',
      created_by_user_id: 'old_user',
      designated_to_user_id: 'old_user',
      title: 'old Title',
    });
    const service = new SaveTaskService(fakeTaskRepository);
    const result = await service.execute({
      id: 'uuid',
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
