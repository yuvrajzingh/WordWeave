'use client';

import React, { useState } from 'react'
import { z } from 'zod'
import { useSubscriptionStore } from '../../store/store';
import useAdminId from '../../hooks/useAdminId';
import { useToast } from './ui/use-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { PlusCircleIcon } from 'lucide-react';
import { Button } from './ui/button';

import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { ToastAction } from '@radix-ui/react-toast';
import { getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { addChatRef, chatMembersRef } from '@/lib/converters/ChatMembers';
import { getUserByEmailRef } from '@/lib/converters/User';
import ShareLink from './ShareLink';


const formSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
})

function InviteUser({chatId} : {chatId: string}) {
    const { data: session } = useSession();
    const { toast } = useToast();
    const adminId = useAdminId({ chatId });
    const subscription = useSubscriptionStore((state) => state.subscription);
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [openInviteLink, setOpenInviteLink] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>){
        if(!session?.user.id) return;

        toast({
            title: "Sending Invite",
            description: "Sending invite to user",
        })

        //we need to get the users current chats to check if they are about to exceed the PRO plan
        const noOfUsersInChat = (await getDocs(chatMembersRef(chatId))).docs.map((doc) => doc.data()).length;

        //check if the user is about to exceed the PRO plan which is 3 chats
        //TODO:also Check if the role is pro or not
        const isPro = subscription?.status === "active";
        
        if(!isPro && noOfUsersInChat >= 2){
            toast({
                title: "Free plan limit exceeded",
                description: "You have exceeded the limit of users in a single chat for the FREE plan. Please upgrade to PRO to add more users!",
                variant: "destructive",
            action: (
                <ToastAction
                    altText='Upgrade'
                    onClick={() => router.push("/register")}
                >
                    Upgrade to PRO
                </ToastAction>
            ),
            })

            return;
        }

        const querySnapshot = await getDocs(getUserByEmailRef(values.email));

        if (querySnapshot.empty){
            toast({
                title: "User not found",
                description: "Please enter an email address of a registered user OR resend the invitation once they have signed up!",
                variant: "destructive",
            })
            return ;
        }else{
            const user = querySnapshot.docs[0].data();

            await setDoc(addChatRef(chatId, user.id), {
                userId: user.id!,
                email: user.email!,
                timestamp: serverTimestamp(),
                chatId: chatId,
                isAdmin: false,
                image: user.image || "",
            }).then(() => {
                setOpen(false);

                toast({
                    title: "Added to Chat",
                    description: "User has been added to the chat successfully!",
                    className: "bg-green-600 text-white",
                    duration: 3000,
                })

                setOpenInviteLink(true);
            })
        }

        form.reset();

    } 

    return (
    adminId === session?.user.id && (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircleIcon className="mr-1" />
                        Add User to Chat
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add User to Chat</DialogTitle>
                        <DialogDescription>
                            Simply enter a another users email address to invite them to this chat!{" "}
                            <span className='text-indigo-600 font-bold'>
                                (Note: They must be registered)
                            </span>
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form 
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='flex flex-col space-y-2'
                        >
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="john@doe.com" {...field}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}              
                            />
                                <Button
                                    className='ml-auto sm:w-fit w-full'
                                    type='submit'
                                >Add to Chat</Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <ShareLink
                isOpen={openInviteLink}
                setIsOpen={setOpenInviteLink}
                chatId={chatId}
            />


        </>
    )
  )
}

export default InviteUser