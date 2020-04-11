export interface iMessage {
    idMessage : string;
    idSender : string;
    message: string;
    timestamp: any;
    file?: string;
    type: string;
  }