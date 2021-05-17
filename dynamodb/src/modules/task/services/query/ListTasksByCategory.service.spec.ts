import FakeTaskRepository from '@modules/task/repositories/fakes/FakeTaskRepository';
import AppError from '@shared/erros/AppError';

import ListTasksByCategoryService from './ListTasksByCategory.service';

let fakeTaskRepository: FakeTaskRepository;

describe('ListTasksByCategory', () => {
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
    const service = new ListTasksByCategoryService(fakeTaskRepository);
    const result = await service.execute('Category');

    expect(result.pagination).toEqual(
      expect.objectContaining({
        count: 1,
      }),
    );
  });

  it('shold be able to return exception when task not found', async () => {
    const service = new ListTasksByCategoryService(fakeTaskRepository);
    await expect(service.execute('Category')).rejects.toBeInstanceOf(AppError);
  });
});
