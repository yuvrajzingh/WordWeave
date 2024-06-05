'use client';

import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { auth } from "../../firebase";
import { signInWithCustomToken } from "firebase/auth";


async function syncFirebaseAuth(session: Session){
    if(session && session.firebaseToken){
        try{
            await signInWithCustomToken(auth, session.firebaseToken)
        }catch(error){
            console.log('Error Signing in with custom token', error);
        }
    }else{
        auth.signOut()
    }
}



const FirebaseAuthProvider = ({children}: { children: React.ReactNode}) => {

    const {data: session} = useSession();

    useEffect(()=>{
        if(!session) return;
        syncFirebaseAuth(session);
    }, [session])

  return <>{children}</>
}

export default FirebaseAuthProvider