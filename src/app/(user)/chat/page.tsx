import ChatList from '@/components/ChatList';
import React from 'react'

type Props = {
    params: {};
    searchParams: {
        error: string;
    };
};

function ChatsPage({searchParams: {error}} : Props) {
  return (
    <div>
        {/* Chat Permission  */}

        {/* Chat list  */}
        <ChatList />
    </div>
  )
}

export default ChatsPage