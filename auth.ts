import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { adminAuth, adminDb } from "./firebase-admin";
import { Adapter } from "next-auth/adapters";


export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    callbacks: {
        session: async ({session, token})=>{
            if(session?.user){
                if(token.sub){
                    session.user.id = token.sub;

                    const firebaseToken = await adminAuth.createCustomToken(token.sub);
                    session.firebaseToken = firebaseToken;
                }
            }
            return session;
        },
        jwt: async({user, token})=>{
            if(user){
                token.sub = user.id;  //when we sign in we get the user's id in sub property, so here we are appending the id to our user. 
            }
            return token;
        }
    },
    session: {
        strategy: 'jwt',
    },
    adapter: FirestoreAdapter(adminDb) as Adapter,
} satisfies NextAuthOptions; 