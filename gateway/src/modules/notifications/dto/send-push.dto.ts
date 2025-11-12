export class SendPushDto {
  recipient_user_id: string;
  title: string;
  body: string;
  image?: string;
  link?: string;
}
