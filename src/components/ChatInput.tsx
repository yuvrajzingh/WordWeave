'use client'

import { useSession } from "next-auth/react";
import {  useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { limitedMessageRef, messagesRef, User } from "@/lib/converters/Message";
import { useRouter } from "next/navigation";
import { useSubscriptionStore } from "../../store/store";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";

const formSchema = z.object({
    input: z.string().max(1000),
})

function ChatInput({chatId} : { chatId: string }) {
    const { data: session } = useSession();
    const router = useRouter();
    const {toast} = useToast();
    const subscription = useSubscriptionStore((state)=> state.subscription);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            input: "", 
        }
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if(values.input.length === 0) return;

        if(!session?.user) return

        //TODO: Check if the user is pro and limit them creating a new chat


        const messages = (await getDocs(limitedMessageRef(chatId))).docs.map((doc) => doc.data()).length; 

        //TODO: check if the role is pro as well
        const isPro = subscription?.status === "active";

        if(!isPro && messages >= 20) {
            toast({
                title: "Free Plan limit exceeded",
                description: "Youv've exceeded the FREE plan limit of 20 message per chat. Upgrade to PRO for unlimited chat messages!",
                variant: "destructive",
                action: (
                    <ToastAction altText="Upgrade to PRO" onClick={()=> router.push("/register")}>
                        Upgrade to PRO
                    </ToastAction>
                )
            })
        }

        const userToStore: User = {
            id: session.user.id!,
            name: session?.user.name!,
            email: session?.user.email!,
            image: session?.user.image || "",
        }
    
        addDoc(messagesRef(chatId), {
            input: values.input,
            timestamp: serverTimestamp(),
            user: userToStore,
    
        })

        form.reset();
    }


  return (
    <div className="sticky bottom-8">
        <Form {...form}>
            <form 
                action=""
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex space-x-2 p-2 rounded-t-xl max-w-4xl mx-auto bg-white border-none dark:bg-slate-800"
            >
                <FormField
                    control={form.control}
                    name="input"
                    render={({field}) => (
                        <FormItem className="flex-1">
                        <FormControl>
                            <Input
                                className="border-none bg-transparent dark:placeholder:text-white/70"
                                placeholder="Enter message in ANY language..."
                                {...field}
                                />
                        </FormControl>
                        <FormMessage />
                        </FormItem>

                    )}
                />
                <Button type="submit" className="bg-violet-600">Send</Button>
            </form>
        </Form>
    </div>
  )
}

export default ChatInput