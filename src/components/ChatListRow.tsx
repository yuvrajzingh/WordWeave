'use client';
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Skeleton } from "./ui/skeleton";
import {Message, limitedSortedMessagesRef } from "@/lib/converters/Message";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UserAvatar from "./UserAvatar";
import { useLanguageStore } from "../../store/store";
import { Separator } from "./ui/separator";

function ChatListRow({chatId} : {chatId: string}) {
    const [messages , loading, error] = useCollectionData<Message>(
        limitedSortedMessagesRef(chatId)
    )

    const language = useLanguageStore((state) => state.language);
    const { data: session } = useSession();
    const router = useRouter();

    function prettyUUID(n=4){
      return chatId.substring(0,n);
    }

    const row = (message?: Message) => (
      <div
        key={chatId}
        onClick={()=>router.push(`/chat/${chatId}`)}
        className=" cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700"
      >
        <div className="flex p-5 items-center space-x-2">

        <UserAvatar 
          name={message?.user.name||session?.user.name}
          image={message?.user.image||session?.user.image}
          />

        <div className="flex-1">
          <p className="font-bold">
            {!message && "New Chat"}
            {message && [message?.user.name || session?.user.name].toString().split(" ")[0]}
          </p>
          
          <p className="text-gray-400 line-clamp-1">
            {message?.translated?.['en'] || "Get the conversation started..."}
          </p>
        </div>

        <div className="text-xs text-gray-400 text-right">
          <p className="mb-auto">
            {message ? new Date(message.timestamp).toLocaleTimeString() : "No messages yet"}
          </p>
          <p className="">chat #{prettyUUID()}</p>
        </div>
        </div>
        <Separator className="dark:bg-slate-800" />
      </div>
    );

  return (
    <div>
      {loading && (
        <div className="flex p-5 items-center space-x-2">
          <Skeleton className="h-12 w-12 rounded-full"/>
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-full"/>
            <Skeleton className="h-4 w-14"/>
          </div>
        </div>
      )}

      {messages?.length === 0 && !loading && row()}

      {messages?.map((message)=>row(message))}

    </div>
  )
}

export default ChatListRow