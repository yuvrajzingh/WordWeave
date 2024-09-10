'use client'

import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
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
import { SendIcon, ArrowUpCircle } from "lucide-react"; // Add the ArrowUpCircle icon for the scroll button
import { useEffect, useState } from "react";

const formSchema = z.object({
    input: z.string().max(1000),
})

function ChatInput({ chatId }: { chatId: string }) {
    const { data: session } = useSession();
    const router = useRouter();
    const { toast } = useToast();
    const subscription = useSubscriptionStore((state) => state.subscription);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            input: "",
        }
    });

    const [messageLimitExceeded, setMessageLimitExceeded] = useState(false); // State to track if message limit is exceeded

    useEffect(() => {
        async function checkMessageLimit() {
            if (!session?.user) return;

            const messages = (await getDocs(limitedMessageRef(chatId))).docs.map((doc) => doc.data()).length;
            const isPro = subscription?.status === "active";

            // If the user is not a pro member and has reached the message limit
            if (!isPro && messages >= 20) {
                setMessageLimitExceeded(true); // Disable input and button
                toast({
                    title: "Free Plan limit exceeded",
                    description: "You've exceeded the FREE plan limit of 20 messages per chat. Upgrade to PRO for unlimited chat messages!",
                    variant: "destructive",
                    action: (
                        <ToastAction altText="Upgrade to PRO" onClick={() => router.push("/register")}>
                            Upgrade to PRO
                        </ToastAction>
                    )
                });
            } else {
                setMessageLimitExceeded(false); // Allow input if within limit
            }
        }

        checkMessageLimit();
    }, [chatId, session, subscription, toast, router]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const inputCopy = values.input.trim();
        form.reset();

        if (inputCopy.length === 0 || messageLimitExceeded) return; // Prevent submission if limit is exceeded

        const userToStore: User = {
            id: session?.user.id!,
            name: session?.user.name!,
            email: session?.user.email!,
            image: session?.user.image || "",
        }

        await addDoc(messagesRef(chatId), {
            input: inputCopy,
            timestamp: serverTimestamp(),
            user: userToStore,
        });
    }

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }

    return (
        <div className="sticky bottom-0">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex space-x-2 p-2 rounded-t-xl max-w-4xl mx-auto bg-violet-200 border-none dark:bg-slate-800"
                >
                    <FormField
                        control={form.control}
                        name="input"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormControl>
                                    <Input
                                        className="border-none bg-transparent dark:placeholder:text-white/70"
                                        placeholder={messageLimitExceeded ? "Upgrade to PRO to continue chatting..." : "Enter message in ANY language..."}
                                        disabled={messageLimitExceeded} // Disable input if limit is exceeded for non-pro members
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        className={`bg-violet-600 text-white font-medium dark:hover:bg-violet-700 ${messageLimitExceeded ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={messageLimitExceeded} // Disable button if limit is exceeded for non-pro members
                    >
                        Send <SendIcon className="ml-1 h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        onClick={scrollToTop}
                        className="bg-gray-600 text-white hover:bg-gray-700 rounded-full p-2"
                        title="Scroll to Top"
                    >
                        <ArrowUpCircle className="h-5 w-5" />
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default ChatInput;
