//This is just to add the id property to the session
// So we are basically changing the type of the session to take id value as a type as well


import NextAuth, {DefaultSession} from "next-auth";

declare module 'next-auth' {
    interface Session {
        firebaseToken?: string;
        user: {
            id: string;
        } & DefaultSession["user"]
    }
}

