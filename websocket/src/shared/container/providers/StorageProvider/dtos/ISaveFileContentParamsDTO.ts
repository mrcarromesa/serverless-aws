export default interface ISaveFileContentParamsDTO {
  bucket: string;
  key: string;
  body: string;
  content_type?: string;
}
