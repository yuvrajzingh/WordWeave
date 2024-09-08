"use client";

import { Message, sortedMessageRef } from "@/lib/converters/Message";
import { Session } from "next-auth";
import { useLanguageStore } from "../../store/store";
import { createRef, useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { MessageCircleIcon } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import UserAvatar from "./UserAvatar";

function ChatMessages({
  chatId,
  session,
  initialMessages,
}: {
  chatId: string;
  session: Session | null;
  initialMessages: Message[];
}) {
  const language = useLanguageStore((state) => state.language);
  const messagesEndRef = createRef<HTMLDivElement>();

  const [messages, loading, error] = useCollectionData<Message>(
    sortedMessageRef(chatId),
    {
      initialValue: initialMessages,
    }
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, messagesEndRef]);

  return (
    <div className="p-5">
      {!loading && messages?.length === 0 && (
        <div className="flex flex-col items-center text-center justify-center p-20 rounded-xl space-y-2 bg-indigo-400 text-white font-extralight">
          <MessageCircleIcon className="h-10 w-10" />
  
          <h2>
            <span className="font-bold">Invite a friend</span> &{" "}
            <span className="font-bold">
              Send your first message in ANY language
            </span>{" "}
            below to get started!
          </h2>
          <p>Our AI will auto-detect & translate it all for you</p>
        </div>
      )}
  
      {messages?.map((message) => {
        const isSender = message.user.id === session?.user.id;
  
        // Assuming message.timestamp is available and formatted correctly
        const messageTime = new Date(message.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
  
        return (
          <div key={message.id} className="flex my-2 items-end">
            <div
              className={`flex flex-col relative space-y-2 p-4 w-fit max-w-[50%] mx-2 rounded-lg ${
                isSender
                  ? "ml-auto bg-violet-600 text-white rounded-br-none"
                  : "bg-gray-200 dark:text-gray-100 dark:bg-slate-700 rounded-bl-none"
              }`}
            >
              <div className="flex items-center justify-between space-x-2">
                {isSender ? (
                  <>
                    <span
                      className={`text-xs text-gray-300 ${
                        isSender ? "text-right" : "text-left"
                      }`}
                    >
                      {messageTime}
                    </span>
                    <p
                      className={`p-1 px-2 text-white text-xs rounded-md italic capitalize line-clamp-1 w-fit ${
                        isSender
                          ? "self-end text-left bg-violet-900"
                          : "self-start text-right bg-gray-900"
                      }`}
                    >
                      {message.user.name.split(" ")[0]}
                    </p>
                  </>
                ) : (
                  <>
                    <p
                      className={`p-1 px-2 text-white text-xs rounded-md italic capitalize line-clamp-1 w-fit ${
                        isSender
                          ? "self-end text-left bg-violet-900"
                          : "self-start text-right bg-gray-900"
                      }`}
                    >
                      {message.user.name.split(" ")[0]}
                    </p>
                    <span
                      className={`text-xs dark:text-gray-300 ${
                        isSender ? "text-right" : "text-left"
                      }`}
                    >
                      {messageTime}
                    </span>
                  </>
                )}
              </div>
              <div
                className={`flex space-x-2 ${
                  isSender ? "justify-start" : "justify-end"
                }`}
              >
                <p className={`font-medium break-words`}>
                  {message.translated?.[language] || message.input}
                </p>
                {!message.translated && <LoadingSpinner />}
              </div>
            </div>
  
            <UserAvatar
              name={message.user.name}
              image={message.user.image}
              className={`${!isSender && "-order-1"}`}
            />
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
  
  
}

export default ChatMessages;
