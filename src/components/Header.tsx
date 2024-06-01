import { getServerSession } from "next-auth";
import DarkModeToggle from "./DarkModeToggle";
import Logo from "./Logo";
import UserButton from "./UserButton";
import { authOptions } from "../../auth";
import dotenv from 'dotenv';
import Link from "next/link";
import { MessagesSquareIcon } from "lucide-react";
import CreateChatButton from "./CreateChatButton";


// Load environment variables from .env file
dotenv.config({path: ".env"})


const Header = async () => {

  const session = await getServerSession(authOptions);
  // console.log(session)

  return (
    <header className="sticky top-0 z-50 bg-red-100 dark:bg-gray-900">
      <nav className="flex flex-col sm:flex-row items-center p-5 pl-2 bg-transparent dark:bg-gray-900 max-w-7xl mx-auto">
        <Logo />

        <div className="flex-1 flex items-center justify-end space-x-4">
          {/* LanguageSelect */}

          {session ? (
            <>
              {/* Not prefetching the chat as it can be heavy on the sever  */}
              <Link href={'/chat'} prefetch={false}>
                <MessagesSquareIcon className="text-black dark:text-light" />
              </Link> 
              <CreateChatButton /> 
            </>
          ) : (
            <Link href="/pricing">
              Pricing
            </Link>
          )}


          {/* Session && (
            ...
          ) */}

          {/* Darkmode  */}
          <DarkModeToggle />
          {/* UserButton  */}
          <UserButton session={session} />
        </div>
      </nav>
    </header>
  );
};

export default Header;
