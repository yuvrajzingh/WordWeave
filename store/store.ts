import {create} from "zustand";
import {Subscription} from "@/types/Subscription";

export type LanguageSupported = 
    | "en"
    | "es"
    | "de"
    | "fr"
    | "hi"
    | "pa"
    | "ja"
    | "ru";

export const LanguageSupportedMap: Record<LanguageSupported, string> = {
    en: "English",
    es: "Spanish",
    de: "German",
    fr: "French",
    hi: "Hindi",
    pa: "Punjabi",
    ja: "Japanese",
    ru: "Russian", 
};

interface SubscriptionState {
    subscription: Subscription | null | undefined;
    setSubscription: (subscription: Subscription | null) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set)=>({
    subscription: undefined,
    setSubscription: (subscription: Subscription | null) => set({ subscription }),
}));