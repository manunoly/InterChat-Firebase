import { iMessage } from './message.model';
import { iUser } from './user.model';

export interface iChat {
    idChat?: string;
    title?: string;
    createdBy: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    typing?: boolean;
    lastMessage?: string;
    typeLastMessage: string;
    timestamp: Number;
    participantsIDS: string[];
    participantsMeta: iUser[];
    messages?: iMessage[];
}