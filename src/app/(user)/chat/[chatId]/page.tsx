import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth";
import ChatInput from "@/components/ChatInput";

type Props = {
  params: {
    chatId: string;
  };
}

async function ChatPage({ params: { chatId } }: Props) {
  const session = await getServerSession(authOptions);

  return (
    <>
      {/* Admin Controls  */}
      {/* Chat Members Badge  */}
      {/* Chat Messages  */}
      {/* Chat Input  */}
      <ChatInput chatId={chatId} />
    </>
  );
}

export default ChatPage;
