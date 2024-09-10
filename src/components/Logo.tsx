"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { AspectRatio } from "./ui/aspect-ratio"; // Adjust the import path accordingly

function LogoComponent() {
  const { theme } = useTheme();

  return (
    <div className="flex items-center w-72 h-14">
      <AspectRatio ratio={16 / 9} className="flex items-center justify-center space-x-1">
        <Image
          src={theme === "dark" ? "/images/logo-dark.png" : "/images/logo.png"} // Conditional rendering based on theme
          width={50}
          height={50}
          alt="logo"
        />
        <h1 className="text-3xl font-bold text-slate-900 dark:text-light">
          <Link href="/">WordWeave</Link>
        </h1>
      </AspectRatio>
    </div>
  );
}

export default LogoComponent;
