export interface iMessage {
    idMessage : string;
    idSender : string;
    message: string;
    timestamp: firebase.firestore.Timestamp;
    file?: string;
    type: string;
  }