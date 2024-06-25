"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";

const CheckoutButton = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const createCheckoutSession = async () => {
    if (!session?.user.id) return;
    // push a doc into firestore db
    setLoading(true);

    const docRef = await addDoc(
      collection(db, "customer", session.user.id, "checkout_session"),
      {
        price: "", //TODO:set price
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      }
    );
    // ... stripe extension on firebase will create a checkout session

    // redirect user to checkout page
  };

  return (
    <div className="flex flex-col space-y-2">
      {/* if subscribed show me the user is subscribed  */}

      <Button className="mt-8 block rounded-md bg-indigo-600 px-3.5 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer disabled:opacity-80 disabled:bg-indigo-600/50 disabled:text-white disabled:cursor-default">
        Sign Up
      </Button>
    </div>
  );
};

export default CheckoutButton;
