import FakeTaskRepository from '@modules/task/repositories/fakes/FakeTaskRepository';
import AppError from '@shared/erros/AppError';

import ListTasksPaginatedService from './ListTasksPaginated.service';

let fakeTaskRepository: FakeTaskRepository;

describe('ListTasksPaginated', () => {
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
    const service = new ListTasksPaginatedService(fakeTaskRepository);
    const result = await service.execute({
      limit: 20,
    });

    expect(result.pagination).toEqual(
      expect.objectContaining({
        count: 1,
      }),
    );
  });

  it('shold be able to return exception when task not found', async () => {
    const service = new ListTasksPaginatedService(fakeTaskRepository);
    await expect(
      service.execute({
        limit: 20,
        start_key: {},
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
