export default interface IWebsocketSchemaDTO {
  id: string;
  msg: string;
  status?: string;

  created_at: Date;
  updated_at: Date;
}
