import ISelectFileContentParamsDTO from '../dtos/ISelectFileContentParamsDTO';

export default interface IStorageProvider {
  selectFileContent<T>(data: ISelectFileContentParamsDTO): Promise<T[]>;
}
