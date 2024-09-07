import {db} from "../../../firebase";

import{
    DocumentData,
    FirestoreDataConverter,
    QueryDocumentSnapshot,
    SnapshotOptions,
    collection,
    query,
    where,
} from 'firebase/firestore'

import { User } from 'next-auth';

const userConverter: FirestoreDataConverter<User> = {
    toFirestore: function(user: User): DocumentData{
        return {
            email: user.email,
            image: user.image,
            name: user.name,
        };
    },
    fromFirestore: function(
        snapshot: QueryDocumentSnapshot<DocumentData>,
        options: SnapshotOptions
    ): User {
        const data = snapshot.data(options)
        return {
            id: snapshot.id,
            email: data.email,
            image: data.image,
            name: data.name,
        }
    },
};

export const getUserByEmailRef = (email: string) => 
    query(
        collection(db, "users"),
        where("email", "==", email)
    ).withConverter(userConverter);