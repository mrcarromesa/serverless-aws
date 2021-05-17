import FakeTaskRepository from '@modules/task/repositories/fakes/FakeTaskRepository';
import AppError from '@shared/erros/AppError';

import ListTaskByUserCreatedService from './ListTaskByUserCreated.service';

let fakeTaskRepository: FakeTaskRepository;

describe('ListTaskByUserCreated', () => {
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
    const service = new ListTaskByUserCreatedService(fakeTaskRepository);
    const result = await service.execute('old_user');

    expect(result.pagination).toEqual(
      expect.objectContaining({
        count: 1,
      }),
    );
  });

  it('shold be able to return exception when task not found', async () => {
    const service = new ListTaskByUserCreatedService(fakeTaskRepository);
    await expect(service.execute('uuid')).rejects.toBeInstanceOf(AppError);
  });
});
