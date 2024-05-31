"use client";

import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <div className="flex items-center w-72 h-14">
      <AspectRatio ratio={16/9} className="flex items-center justify-center" >
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-light">
          <Link href="/">WordWeave</Link>
        </h1>
      </AspectRatio>
    </div>
  );
};

export default Logo;
