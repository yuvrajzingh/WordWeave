import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth'

async function ChatList() {
    const session = await getServerSession(authOptions)
  return (
    <div>ChatList</div>
  )
}

export default ChatList