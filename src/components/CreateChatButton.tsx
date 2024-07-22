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

const CreateChatButton = ({ isLarge }: {isLarge?: boolean}) => {

    const {data: session} = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const subscription = useSubscriptionStore((state)=> state.subscription);

    const createNewChat = async ()=>{
      if(session?.user.id) return;

      setLoading(true);
      toast({
        title: "Creating new chat...",
        description: "Hold tight while we create your new chat...",
        duration: 3000,
      }); 

      //TODO: Check if user is pro and limit them creating a new chat

      // ----

      const chatId = uuidv4()

      
 
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
    <Button variant={"ghost"}>
        <MessageSquarePlusIcon />  
    </Button>
  )
}

export default CreateChatButton