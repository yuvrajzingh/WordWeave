import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth";
import ChatInput from "@/components/ChatInput";
import { getDocs } from "firebase/firestore";
import { sortedMessageRef } from "@/lib/converters/Message";
import ChatMessages from "@/components/ChatMessages";

type Props = {
  params: {
    chatId: string;
  };
}

async function ChatPage({ params: { chatId } }: Props) {
  const session = await getServerSession(authOptions);

  const initialMessages = (await getDocs(sortedMessageRef(chatId))).docs.map((doc) => doc.data());

  return (
    <>
      {/* Admin Controls  */}
      {/* Chat Members Badge  */}
      
      <div className="flex-1">
        <ChatMessages 
          chatId={chatId}
          session={session}
          initialMessages={initialMessages}
        />
      </div>

      {/* Chat Input  */}
      <ChatInput chatId={chatId} />
    </>
  );
}

export default ChatPage;
