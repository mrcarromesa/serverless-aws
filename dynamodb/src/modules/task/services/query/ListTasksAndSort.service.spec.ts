import FakeTaskRepository from '@modules/task/repositories/fakes/FakeTaskRepository';
import AppError from '@shared/erros/AppError';

import ListTasksAndSortService from './ListTasksAndSort.service';

let fakeTaskRepository: FakeTaskRepository;

describe('ListTasksAndSortService', () => {
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
    const service = new ListTasksAndSortService(fakeTaskRepository);
    const result = await service.execute({
      category: 'Category',
      limit: 1,
      start_key: { id: 'uuid' },
    });

    expect(result.pagination).toEqual(
      expect.objectContaining({
        count: 1,
      }),
    );
  });

  it('shold be able to get a task same start_key undefined', async () => {
    const service = new ListTasksAndSortService(fakeTaskRepository);

    await expect(
      service.execute({
        category: 'Category',
        limit: 1,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
