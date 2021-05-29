import IRemoveFileParamsDTO from '../dtos/IRemoveFileParamsDTO';
import ISaveFileContentParamsDTO from '../dtos/ISaveFileContentParamsDTO';
import ISelectFileContentParamsDTO from '../dtos/ISelectFileContentParamsDTO';
import IStorageProvider from '../models/IStorageProvider';

interface IObjectFile {
  bucket: string;
  key: string;
  body: string;
}

export default class FakeStorageProvider implements IStorageProvider {
  private objectFile: IObjectFile = {} as IObjectFile;

  public async removeFile(_data: IRemoveFileParamsDTO): Promise<void> {
    this.objectFile = {} as IObjectFile;
  }

  public async saveTextToS3InGzip(
    data: ISaveFileContentParamsDTO,
  ): Promise<void> {
    this.objectFile = data;
  }

  public async selectFileContent<T>(
    _data: ISelectFileContentParamsDTO,
  ): Promise<T[]> {
    let result: T[] = [];
    try {
      const stringJson = JSON.parse(this.objectFile.body);
      result = stringJson as T[];
    } catch (err) {
      result = (this.objectFile.body || ([] as unknown)) as T[];
    }
    return result;
  }
}
