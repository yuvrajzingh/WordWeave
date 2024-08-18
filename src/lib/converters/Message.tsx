import Email from "next-auth/providers/email";
import { db } from "../../../firebase";
import { LanguagesSupported } from "@/../store/store"

import{
    DocumentData,
    FirestoreDataConverter,
    QueryDocumentSnapshot,
    SnapshotOptions,
    collection,
    collectionGroup,
    doc, 
    limit, 
    orderBy, 
    query,
    where,
} from 'firebase/firestore' 

export interface User {
    id: string;
    email: string; 
    name: string;
    image: string;
}

export interface Message {
    id?: string;
    input: string;
    timestamp: Date;
    user: User;
    translated?: {
        [K in LanguagesSupported]?: string;
    };
}

const messageConverter: FirestoreDataConverter<Message> = {
    toFirestore: function(message: Message): DocumentData{
        return {
           input: message.input,
           timestamp: message.timestamp,
           user: message.user,

        }
    },

    fromFirestore: function(
        snapshot: QueryDocumentSnapshot<DocumentData>,
        options: SnapshotOptions
    ): Message {
        const data = snapshot.data(options); 

        return {
            id: snapshot.id,
            input: data.input,
            timestamp: data.timestamp?.toDate(),
            translated: data.translated,
            user: data.user,
        }
    }
};

export const messagesRef = (chatId: string) => 
    collection(db, "chats", chatId, "messages").withConverter(messageConverter);

export const limitedMessageRef = (chatId: string) =>
    query(messagesRef(chatId), limit(25));

export const sortedMessageRef = (chatId: string) =>
    query(messagesRef(chatId), orderBy("timestamp", "asc"));

export const limitedSortedMessagesRef = (chatId: string) =>
    query(query(messagesRef(chatId), limit(1)), orderBy("timestamp", "desc"))
