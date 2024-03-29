import IAttachmentsDTO from './IAttachmentsDTO';

export default interface ITaskSaveDTO {
  id: string;
  category: string;
  created_by_user_id: string;
  designated_to_user_id: string;
  date?: Date;
  title: string;
  description?: string;
  attachments?: IAttachmentsDTO[];
}
