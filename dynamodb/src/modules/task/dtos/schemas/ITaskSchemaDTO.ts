import IAttachmentsDTO from '../props/IAttachmentsDTO';

export default interface ITaskSchemaDTO {
  id: string;
  category: string;
  created_by_user_id: string;
  designated_to_user_id: string;
  user_delivered?: string;
  delivery_date?: Date;
  title: string;
  description?: string;
  attachments?: IAttachmentsDTO[];
  status?: string;
  created_at: Date;
  updated_at: Date;
}
