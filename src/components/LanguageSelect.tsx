'use client';

import { usePathname } from "next/navigation";
import { useLanguageStore, useSubscriptionStore } from "../../store/store";

function LanguageSelect() {
  const [language, setLanguage, getLanguage, getNoSupportedLanguages ] = 
  useLanguageStore((state)=>[
    state.language,
    state.setLanguage,
    state.getLanguages,
    state.getNotSupportedLanguages,
  ])

  const subscription = useSubscriptionStore((state) => state.subscription);

  const isPro = subscription?.status === 'active';
  //TODO: the above should also check if subscription?.role === 'pro'    

  const pathName = usePathname();
  const isChatPage = pathName.includes("/chat");

  return isChatPage && (
    <div>LanguageSelect</div>
  )
}

export default LanguageSelect