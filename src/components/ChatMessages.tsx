"use client";

import { Message, sortedMessageRef } from "@/lib/converters/Message";
import { Session } from "next-auth";
import { useLanguageStore } from "../../store/store";
import { createRef, useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { MessageCircleIcon } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import UserAvatar from "./UserAvatar";
import { Separator } from "./ui/separator";

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

  // Helper function to format the date
  const formatDate = (timestamp: string | number | Date) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Function to determine if a new date should be displayed
  const shouldDisplayDate = (currentMessage: Message, previousMessage?: Message) => {
    if (!previousMessage) return true; // Display date for the first message
    const currentDate = formatDate(currentMessage.timestamp);
    const previousDate = formatDate(previousMessage.timestamp);
    return currentDate !== previousDate;
  };

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

      {messages?.map((message, index) => {
        const isSender = message.user.id === session?.user.id;
        const messageTime = new Date(message.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        // Determine if the date should be displayed
        const showDate = shouldDisplayDate(message, messages[index - 1]);

        return (
          <div key={message.id}>
            {showDate && (
              <div className="flex items-center my-4 text-gray-500 font-light">
                <Separator className="flex-1 dark:bg-slate-800" /> 
                <span className="mx-4 whitespace-nowrap">{formatDate(message.timestamp)}</span> 
                <Separator className="flex-1 dark:bg-slate-800" /> 
             </div>
            )}
            
            <div className="flex my-2 items-end">
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
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatMessages;
