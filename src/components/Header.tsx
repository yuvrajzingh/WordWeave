import { getServerSession } from "next-auth";
import DarkModeToggle from "./DarkModeToggle";
import Logo from "./Logo";
import UserButton from "./UserButton";
import { authOptions } from "../../auth";
import Link from "next/link";
import { MessagesSquareIcon } from "lucide-react";
import CreateChatButton from "./CreateChatButton";
import UpgradeBanner from "./UpgradeBanner";
import LanguageSelect from "./LanguageSelect";



const Header = async () => {

  const session = await getServerSession(authOptions);
 
  return (
    <header className="sticky top-0 z-50 bg-white/30 backdrop-blur-md shadow-md dark:bg-black/5">
     
      <nav className="flex flex-col lg:flex-row space-y-3 items-center p-5 pl-2 bg-transparent  max-w-7xl mx-auto">
        <Logo />

        <div className="flex-1 flex items-center sm:justify-end space-x-4">
          <LanguageSelect />

          {session ? (
            <>
              {/* Not prefetching the chat as it can be heavy on the server  */}
              <Link href={'/chat'} prefetch={false}>
                <MessagesSquareIcon className="text-black dark:text-light" />
              </Link> 
              <CreateChatButton /> 
            </>
          ) : (
            <Link href="/pricing" className="font-medium">
              Pricing
            </Link>
          )}

          <DarkModeToggle />

          <UserButton session={session} />
        </div>
      </nav>

          <UpgradeBanner />

    </header>
  );
};

export default Header;
