import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";

const UserAvatar = ({
    name,
    image, 
    className
}: {
    name?: string | null;
    image?:string | null ;
    className?: string; 
}) => {
  return (
    <Avatar className={cn("bg-white text-black", className)}>
        {image && (
            <Image 
                src={image}
                alt={name || "User Name"}
                width={40}
                height={40}
                className="rounded-full"
            />
        )}
      {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
      <AvatarFallback 
      delayMs={1000}
      className="dark:bg-white dark:text-dark text-lg">
        {
            name
                ?.split(" ")
                .map((n)=> n[0])
                .join("")
        }
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
