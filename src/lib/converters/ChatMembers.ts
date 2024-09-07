import Email from "next-auth/providers/email";
import { db } from "../../../firebase";
import{
    DocumentData,
    FirestoreDataConverter,
    QueryDocumentSnapshot,
    SnapshotOptions,
    collection,
    collectionGroup,
    doc, 
    query,
    where,
} from 'firebase/firestore' 

export interface ChatMembers {
    userId: string; 
    email: string;
    timestamp: Date | null;
    isAdmin: boolean;
    chatId: string;
    image: string;
}

const chatMembersConverter: FirestoreDataConverter<ChatMembers> = {
    toFirestore: function(member: ChatMembers): DocumentData{
        return {
            userId: member.userId,
            email: member.email,
            timestamp: member.timestamp,
            isAdmin: !!member.isAdmin,
            chatId: member.chatId,
            image: member.image,
        }
    },
    fromFirestore: function(
        snapshot: QueryDocumentSnapshot<DocumentData>,
        options: SnapshotOptions
    ): ChatMembers {
        const data = snapshot.data(options) as DocumentData;

        return {
            userId: snapshot.id,
            email: data.email,
            timestamp: data.timestamp,
            isAdmin: data.isAdmin,
            chatId: data.chatId,
            image: data.image,
        }
    }
};

export const addChatRef = (chatId: string, userId: string)=>
    doc(db, "chats", chatId, "members", userId).withConverter(chatMembersConverter)

export const chatMembersRef = (chatId: string) =>  //to get all the chat members
    collection(db, "chats", chatId, "members").withConverter(chatMembersConverter);

export const chatMemberAdminRef = (chatId: string) => //basically a query to see if there's an admin in the chat
    query(
        collection(db, "chats", chatId, "members"),
        where("isAdmin", "==", true)
    ).withConverter(chatMembersConverter)

export const chatMembersCollectionGroupRef = (userId: string) => //to query all of the diff chat where one member who we are enquiring on, is a part of.
    query(
        collectionGroup(db, "members"),
        where("userId", "==", userId)
    ).withConverter(chatMembersConverter);