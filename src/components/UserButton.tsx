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

const UserButton = ({session} : {session: Session | null }) => {
    //session
    if(!session) return (
        <Button variant={'outline'} onClick={()=>signIn ()}>
            Sign In
        </Button>
    )

  return  session && (
    <DropdownMenu>
      <DropdownMenuTrigger><UserAvatar name={session.user?.name} image={session.user?.image} /></DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={()=>signOut()}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};   

export default UserButton;
