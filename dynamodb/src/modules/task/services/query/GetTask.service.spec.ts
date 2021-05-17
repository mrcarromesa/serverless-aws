import FakeTaskRepository from '@modules/task/repositories/fakes/FakeTaskRepository';
import AppError from '@shared/erros/AppError';

import GetTaskService from './GetTask.service';

let fakeTaskRepository: FakeTaskRepository;

describe('GetTask', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fakeTaskRepository = new FakeTaskRepository();
  });

  it('shold be able to get a task', async () => {
    await fakeTaskRepository.create({
      id: 'uuid',
      category: 'Category',
      created_by_user_id: 'old_user',
      designated_to_user_id: 'old_user',
      title: 'Task Example',
    });
    const service = new GetTaskService(fakeTaskRepository);
    const result = await service.execute({
      id: 'uuid',
      category: 'Category',
    });

    expect(result).toEqual(
      expect.objectContaining({
        title: 'Task Example',
      }),
    );
  });

  it('shold be able to return exception when task not found', async () => {
    const service = new GetTaskService(fakeTaskRepository);
    await expect(
      service.execute({
        id: 'uuid',
        category: 'Category',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
