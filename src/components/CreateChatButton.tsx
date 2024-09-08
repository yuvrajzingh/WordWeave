"use client";

import { useRouter } from 'next/navigation';
import { Button } from './ui/button'
import { MessageSquarePlusIcon } from 'lucide-react'
import { useSession } from 'next-auth/react';
import { useSubscriptionStore } from '../../store/store';
import { useState } from 'react';
import { useToast } from './ui/use-toast';
import LoadingSpinner from './LoadingSpinner';
import {v4 as uuidv4} from "uuid";
import { getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { addChatRef, chatMembersCollectionGroupRef } from '@/lib/converters/ChatMembers';
import { ToastAction } from '@radix-ui/react-toast';

const CreateChatButton = ({ isLarge }: {isLarge?: boolean}) => {

    const {data: session} = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const subscription = useSubscriptionStore((state)=> state.subscription);

    const createNewChat = async ()=>{
      console.log(session)
      if(!session?.user.id) return;
      setLoading(true);
      toast({
        title: "Creating new chat...",
        description: "Hold tight while we create your new chat...",
        duration: 3000,
      }); 

      const numOfChats = (
        await getDocs(chatMembersCollectionGroupRef(session.user.id))
      ).docs.map((doc) => doc.data()).length;
    
      const isPro = subscription?.role === "pro" && subscription.status === "active";

      if(!isPro && numOfChats >= 3){
        toast({
          title: "Error",
          description: "You have reached your chat limit. Please upgrade your plan to create more chats.",
          variant: "destructive",
          action: (
            <ToastAction
              altText='Upgrade'
              onClick={() => router.push("/register")}
            >Upgrade to Pro</ToastAction>
          )
        });
        setLoading(false);
        return;
      }

      const chatId = uuidv4()

      await setDoc(addChatRef(chatId, session.user.id),{
        userId: session.user.id!,
        email: session.user.email!,
        timestamp: serverTimestamp(),
        isAdmin: true,
        chatId: chatId,
        image: session.user.image || "",
      }).then(()=>{
        toast({
          title: "Success",
          description: "Your Chat has been created!",
          className: "bg-green-600 text-white",
          duration: 2000,
        });
        router.push(`/chat/${chatId}`);
      }).catch((error )=>{
        toast({
          title: "Error",
          description: "There was an error creating your chat!",
          variant: "destructive",
        });
      }).finally(()=>{
        setLoading(false);
      })
 
      router.push(`/chat/abc`)
    }

    if(isLarge){
      return (
        <div>
          <Button variant={"default"} onClick={createNewChat}>
            {loading ? <LoadingSpinner/> : "Create a New Chat"}
          </Button>
        </div>
      )
    }

  return (
    <Button variant={"ghost"} onClick={createNewChat}>
        <MessageSquarePlusIcon />  
    </Button>
  )
}

export default CreateChatButton