import { iMessage } from './message.model';
import { iUser } from './user.model';
import * as firebase from 'firebase/app';


export interface iChat {
    idChat?: string;
    title?: string;
    createdBy?: string;
    type?: string;
    createdAt?: any;
    updatedAt?: any;
    typing?: boolean;
    lastMessage?: string;
    typeLastMessage?: string;
    timestamp?: any;
    participantsIDS?: string[];
    participantsMeta?: iUser[];
    messages?: iMessage[];
    avatarUserChat?: string;
    status?: string;
    count?: string;
    idUserReciever? : string; //only for app purpose
    userReciever? : iUser; //only for app purpose
}