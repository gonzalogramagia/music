import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/language-context";

export function ModeSwitch() {
    const { t } = useLanguage();
    const [studyMode, setStudyMode] = useState(false);

    useEffect(() => {
        const updateConfig = () => {
            const mode = localStorage.getItem('config-interface-mode') === 'study';
            setStudyMode(mode);
        };
        updateConfig();
        window.addEventListener('config-update', updateConfig);
        return () => window.removeEventListener('config-update', updateConfig);
    }, []);

    const handleToggleMode = (value: boolean) => {
        localStorage.setItem('config-interface-mode', value ? 'study' : 'music');
        window.dispatchEvent(new Event('config-update'));
    };

    return (
        <div className="flex items-center gap-1 bg-neutral-100 dark:bg-zinc-800 p-1 rounded-full w-fit border border-neutral-200 dark:border-zinc-700 shadow-sm h-[42px]">
            <button
                onClick={() => handleToggleMode(false)}
                className={`h-full aspect-square rounded-full text-base transition-all cursor-pointer flex items-center justify-center ${!studyMode
                        ? "bg-white dark:bg-zinc-700 shadow-sm scale-110"
                        : "opacity-40 hover:opacity-100 grayscale hover:grayscale-0"
                    }`}
                title={t('musicInterface') || "Music"}
            >
                🎵
            </button>
            <button
                onClick={() => handleToggleMode(true)}
                className={`h-full aspect-square rounded-full text-base transition-all cursor-pointer flex items-center justify-center ${studyMode
                        ? "bg-white dark:bg-zinc-700 shadow-sm scale-110"
                        : "opacity-40 hover:opacity-100 grayscale hover:grayscale-0"
                    }`}
                title={t('studyInterface') || "Study"}
            >
                📚
            </button>
        </div>
    );
}
