import React from "react";
import { authOptions } from "../../../auth";
import { getServerSession } from "next-auth";
import PricingCards from "@/components/PricingCards";


const Register = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="isolate h-full overflow-hidden bg-slate-950 pb-40">
      <div
        className="absolute inset-x-0 top-2 -z-10 transform-gpu overflow-hidden blur-3xl"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-16 text-white text-center lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Hi{" "}
            {session?.user?.name
              ? session.user.name.split(" ")[0].charAt(0).toUpperCase() +
                session.user.name.split(" ")[0].slice(1).toLowerCase()
              : ""}
            !, Lets handle your Membership
          </h2>
        </div>
      </div>
      <PricingCards redirect={false} />
    </div>
  )

  
};

export default Register;
