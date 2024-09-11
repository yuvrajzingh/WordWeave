"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { AspectRatio } from "./ui/aspect-ratio"; // Adjust the import path accordingly

function LogoComponent() {
  const { theme } = useTheme();

  return (
    <div className="flex items-center w-72 h-14">
      <AspectRatio
        ratio={16 / 9}
        className="flex items-center justify-center space-x-1"
      >
        <Image
          src={"/images/logo.svg"}
          alt="WordWeave logo"
          width={45}
          height={45}
          className="dark:invert"
          priority 
          loading="eager" 
        />
        <h1 className="text-3xl font-bold text-slate-900 dark:text-light">
          <Link href="/">WordWeave</Link>
        </h1>
      </AspectRatio>
    </div>
  );
}

export default LogoComponent;


