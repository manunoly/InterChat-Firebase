export interface iMessage {
  idMessage : string;
  idSender : string;
  message: string;
  timestamp: firebase.firestore.Timestamp;
  path?: string;
  type: string;
  fileName?: string;
  fileURL?: string;
  fileMimeTyme?: string;
  localFileName?: string;
  audioDuration?: number;
  isMessageInfo?:boolean;
  statusMessage? : string; // only for app purpouse 'sended' | 'readed'
}
