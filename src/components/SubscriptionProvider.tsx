'use client';

import { subscriptionRef } from '@/lib/converters/Subscription';
import { onSnapshot } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { useSubscriptionStore } from '../../store/store';

function SubscriptionProvider({children} : {children: React.ReactNode}) {
    const {data: session} = useSession();
    const setSubscription = useSubscriptionStore(
        (state) => state.setSubscription
    );
    
    useEffect(()=>{
        if(!session) return;

        return onSnapshot(subscriptionRef(session?.user.id), (snapshot)=> {
            if(snapshot.empty){
                console.log("User has No subscription")
                setSubscription(null);
                return;
            }else{
                console.log("User has subscription");
                setSubscription(snapshot.docs[0].data());
            }
        }, (error) =>{
            console.log("Error getting document: ", error);
        })
    }, [session, setSubscription]);

    return (
    <div>{children}</div>
  )
}

export default SubscriptionProvider