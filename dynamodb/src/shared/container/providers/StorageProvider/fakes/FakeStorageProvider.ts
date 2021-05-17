import ISelectFileContentParamsDTO from '../dtos/ISelectFileContentParamsDTO';
import IStorageProvider from '../models/IStorageProvider';

export default class FakeStorageProvider implements IStorageProvider {
  public async selectFileContent<T>(
    _data: ISelectFileContentParamsDTO,
  ): Promise<T[]> {
    const result: T[] = [];
    return result;
  }
}
