import { iMessage } from './message.model';
import { iUser } from './user.model';

export interface iChat {
    idChat?: string;
    title?: string;
    createdBy: string;
    type: string;
    createdAt: any;
    updatedAt: any;
    typing?: boolean;
    lastMessage?: string;
    typeLastMessage: string;
    timestamp: any;
    participantsIDS: string[];
    participantsMeta: iUser[];
    messages?: iMessage[];
}