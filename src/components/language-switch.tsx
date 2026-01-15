
import { useLanguage } from "../contexts/language-context";

export function LanguageSwitch() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-full w-fit">
            <button
                onClick={() => setLanguage("es")}
                className={`px-3 py-2.5 rounded-full text-xs font-medium transition-all cursor-pointer ${language === "es"
                    ? "bg-white shadow-sm text-[#6866D6]"
                    : "text-neutral-500 hover:text-neutral-700"
                    }`}
            >
                ES
            </button>
            <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-2.5 rounded-full text-xs font-medium transition-all cursor-pointer ${language === "en"
                    ? "bg-white shadow-sm text-[#6866D6]"
                    : "text-neutral-500 hover:text-neutral-700"
                    }`}
            >
                EN
            </button>
        </div>
    );
}
