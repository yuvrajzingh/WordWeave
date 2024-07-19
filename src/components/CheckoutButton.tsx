"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase"; 
import LoadingSpinner from "./LoadingSpinner";
import { useSubscriptionStore } from "../../store/store";
import ManageAccountButton from "./ManageAccountButton";

const CheckoutButton = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const subscription = useSubscriptionStore((state)=> state.subscription)

  const isLoadingSubscription = subscription === undefined;
  const isSubscribed = subscription?.status === "active";
  //TODO: the above should also check if subscription?.role === 'pro'

  const createCheckoutSession = async () => {
    if (!session?.user.id) return;
    // push a doc into firestore db
    setLoading(true);

    const docRef = await addDoc(
      collection(db, "customers", session.user.id, "checkout_sessions"),
      {
        price: "price_1PW0Ge2Kz6gyo2OezPGt2Vun",
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      }
    );
    // ... stripe extension on firebase will create a checkout session
    return onSnapshot(docRef, snap=>{
      const data = snap.data();
      const url = data?.url;
      const error = data?.error;

      if(error){
        //show an error to your customer and
        //inspect your cloud fuctions logs in the firebase console.
        alert(`An error occured: ${error.message}`);
        setLoading(false);
      }

      if(url){
        //we have a stripe checkout url, let's redirect.
        window.location.assign(url);
        setLoading(false);
      }

    });
    // redirect user to checkout page
  };

  return (
    <div className="flex flex-col space-y-2">
      {/* if subscribed show me the user is subscribed  */}

      <Button 
      className="mt-8 block rounded-md bg-indigo-600 px-3.5 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer disabled:opacity-80 disabled:bg-indigo-600/50 disabled:text-white disabled:cursor-default">

        {isSubscribed ? (
          <ManageAccountButton />
        ) : isLoadingSubscription || loading ? (
          <LoadingSpinner />
        ) : ( <button onClick={()=> createCheckoutSession}>"Sign Up"</button> )
        }
      </Button>
    </div>
  );
};

export default CheckoutButton;
 