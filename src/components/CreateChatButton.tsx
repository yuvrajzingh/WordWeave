"use client";

import { useRouter } from 'next/navigation';
import { Button } from './ui/button'
import { MessageSquarePlusIcon } from 'lucide-react'

const CreateChatButton = () => {

    const router = useRouter();

    const creatNewChat = async ()=>{
        router.push(`/chat/abc`)
    }

  return (
    <Button variant={"ghost"}>
        <MessageSquarePlusIcon />  
    </Button>
  )
}

export default CreateChatButton