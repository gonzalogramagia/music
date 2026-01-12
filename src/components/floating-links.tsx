import { Home, Smile, Music, BowArrow } from 'lucide-react'
import { useLanguage } from '../contexts/language-context'

export function FloatingLinks() {
    const { language, t } = useLanguage()
    const isEnglish = language === 'en'

    // Logic for URLs
    const getUrl = (baseUrl: string) => isEnglish ? `${baseUrl}/en` : baseUrl

    const homeUrl = getUrl("https://home.gonzalogramagia.com")
    const emojisUrl = getUrl("https://emojis.gonzalogramagia.com")
    // const musicUrl = getUrl("https://music.gonzalogramagia.com") // Unused because button is disabled

    // Apply localization to ClickUp as well per user request "todos los botones"
    const clickUpUrlLocalized = isEnglish ? "https://clickup.gonzalogramagia.com/en" : "https://clickup.gonzalogramagia.com"

    return (
        <div className="fixed bottom-8 left-8 flex gap-3 z-50">
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

            {/* ClickUp Button */}
            <a
                href={clickUpUrlLocalized}
                className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group cursor-pointer"
                aria-label={t('ariaClickUp')}
                title={t('ariaClickUp')}
            >
                <BowArrow className="w-6 h-6 text-gray-900 dark:text-white group-hover:text-yellow-500 transition-colors" />
            </a>
        </div>
    )
}
