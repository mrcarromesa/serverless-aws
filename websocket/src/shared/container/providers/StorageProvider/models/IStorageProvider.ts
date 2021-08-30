import IRemoveFileParamsDTO from '../dtos/IRemoveFileParamsDTO';
import ISaveFileContentParamsDTO from '../dtos/ISaveFileContentParamsDTO';
import ISelectFileContentParamsDTO from '../dtos/ISelectFileContentParamsDTO';

export default interface IStorageProvider {
  selectFileContent<T>(data: ISelectFileContentParamsDTO): Promise<T[]>;
  saveTextToS3InGzip(data: ISaveFileContentParamsDTO): Promise<void>;
  removeFile(data: IRemoveFileParamsDTO): Promise<void>;
}
