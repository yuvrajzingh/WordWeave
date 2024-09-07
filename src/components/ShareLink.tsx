import { Dispatch, SetStateAction } from "react"
import { useToast } from "./ui/use-toast";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader } from "./ui/dialog";
import { Button } from "./ui/button";
import { Copy, CopyIcon } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";


function ShareLink({
    isOpen,
    chatId,
    setIsOpen,
} : {
    isOpen: boolean,
    chatId: string,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
}) {

    const { toast } = useToast();
    const host = window.location.host;

    const linkToChat = process.env.NODE_ENV === "development"
        ? `http://${host}/chat/${chatId}`
        : `https://${host}/chat/${chatId}`

    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(linkToChat);
            console.log("Link copied to clipboard");
            toast({
                title: "Link Copied",
                description: "Share this to the person you want to chat with! (NOTE: They must be added to the Chat tp access it!)",
                className: "bg-green-600 text-white",
            })
        } catch (error) {
            console.log("Failed to copy text: ", error  )
        }
    }

  return (
    <Dialog
        onOpenChange={(open) => setIsOpen(open)}
        open={isOpen}
        defaultOpen={isOpen}
    >
        <DialogTrigger asChild>
            <Button variant="outline">
                <CopyIcon className="mr-2"/>
                Share Link
            </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogDescription>
                    Any user who has been{" "}
                    <span className="text-indigo-600 font-bold">granted access </span>
                    can use this link
                </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                    <Label htmlFor="link" className="sr-only">Link</Label>
                    <Input id="link" defaultValue={linkToChat} readOnly />
                </div>
                <Button
                    onClick={() => copyToClipboard()}
                    type="submit"
                    size="sm"
                    className="px-3"
                >
                    <span className="sr-only">Copy</span>
                    <CopyIcon className="h-4 w-4"/>   
                </Button>
            </div>
            <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Close
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default ShareLink