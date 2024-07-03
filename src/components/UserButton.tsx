"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import { Button } from "./ui/button";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import LoadingSpinner from "./LoadingSpinner";
import { useSubscriptionStore } from "../../store/store";
import { StarIcon } from "lucide-react";

const UserButton = ({session} : {session: Session | null }) => {
    const subscription = useSubscriptionStore((state) => state.subscription); 

    //session
    if(!session) return (
        <Button variant={'outline'} onClick={()=>signIn()}>
            Sign In
        </Button>
    )

  return  session && (
    <DropdownMenu>
      <DropdownMenuTrigger><UserAvatar name={session.user?.name} image={session.user?.image} /></DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {
          subscription === undefined && (
            <DropdownMenuItem>
              <LoadingSpinner />  
            </DropdownMenuItem>
          )
        }

        {
          subscription?.status === 'active' && (
            <>
              <DropdownMenuLabel className="text-xs flex items-center justify-center space-x-1 text-[#E935C1] animate-pulse">
                <StarIcon fill="#E935C1" animate-pulse/>
                <p>PRO</p>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                {/* <ManageAccountButton /> */}
                Manage
              </DropdownMenuItem>
            </>
          )
        }
        <DropdownMenuItem onClick={()=>signOut()}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};   

export default UserButton;
