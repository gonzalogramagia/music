import { Home, Smile, Music, BowArrow, Github, Wrench } from 'lucide-react'
import { useLanguage } from '../contexts/language-context'
import { useState } from 'react'
import ConfigModal from './ConfigModal'

export function FloatingLinks() {
    const { language, t } = useLanguage()
    // const navigate = useNavigate() // Removing unused navigate
    const isEnglish = language === 'en'
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)

    // Logic for URLs
    const getUrl = (baseUrl: string) => isEnglish ? `${baseUrl}/en` : baseUrl

    const homeUrl = getUrl("https://home.gonzalogramagia.com")
    const emojisUrl = getUrl("https://emojis.gonzalogramagia.com")
    // const musicUrl = getUrl("https://music.gonzalogramagia.com") // Unused because button is disabled

    // Apply localization to Tasks as well per user request "todos los botones"
    const tasksUrlLocalized = isEnglish ? "https://tasks.gonzalogramagia.com/en" : "https://tasks.gonzalogramagia.com"

    const exportPath = isEnglish ? '/export' : '/exportar'
    const importPath = isEnglish ? '/import' : '/importar'

    return (
        <>
            {/* Right Side Buttons: Config / Github Toggle */}
            <div className="fixed bottom-8 right-8 flex gap-3 z-[110]">
                {isSettingsOpen ? (
                    <a
                        href="https://github.com/gonzalogramagia/music"
                        className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
                        aria-label="GitHub Repository"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <Github className="w-6 h-6 text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors" />
                    </a>
                ) : (
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group cursor-pointer"
                        aria-label="Configuration"
                    >
                        <Wrench className="w-6 h-6 text-gray-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors scale-x-[-1]" />
                    </button>
                )}
            </div>

            {/* Config Modal */}
            {isSettingsOpen && (
                <ConfigModal
                    lang={language}
                    onClose={() => setIsSettingsOpen(false)}
                    exportPath={exportPath}
                    importPath={importPath}
                />
            )}

            {/* Left Side Buttons */}
            <div className="fixed bottom-8 left-8 flex gap-3 z-30 transition-opacity duration-300">
                {/* Home Button */}
                <a
                    href={homeUrl}
                    className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group cursor-pointer"
                    aria-label={t('ariaHome')}
                    title={t('ariaHome')}
                >
                    <Home className="w-6 h-6 text-zinc-900 dark:text-white group-hover:text-yellow-500 transition-colors" />
                </a>

                {/* Emojis Button */}
                <a
                    href={emojisUrl}
                    className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group cursor-pointer"
                    aria-label={t('ariaEmojis')}
                    title={t('ariaEmojis')}
                >
                    <Smile className="w-6 h-6 text-zinc-900 dark:text-white group-hover:text-yellow-500 transition-colors" />
                </a>

                {/* Music Button (Disabled) */}
                <button
                    disabled
                    className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg transition-all opacity-50 cursor-not-allowed group"
                    aria-label={t('ariaMusic')}
                    title={t('ariaMusic')}
                >
                    <Music className="w-6 h-6 text-zinc-900 dark:text-white transition-colors" />
                </button>

                {/* Tasks Button */}
                <a
                    href={tasksUrlLocalized}
                    className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group cursor-pointer"
                    aria-label={t('ariaTasks')}
                    title={t('ariaTasks')}
                >
                    <BowArrow className="w-6 h-6 text-gray-900 dark:text-white group-hover:text-yellow-500 transition-colors" />
                </a>
            </div>
        </>
    )
}
