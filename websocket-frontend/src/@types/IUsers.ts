export default interface ILastConversation {
  id: string;
  group_id: string;
  from_email: string;
  from_name: string;
  last_msg: string;
  last_date: Date;
  is_typing: boolean;
}
