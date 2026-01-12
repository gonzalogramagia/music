import { BowArrow } from 'lucide-react'

export function ClickupLink() {
    return (
        <a
            href="https://clickup.gonzalogramagia.com"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-8 left-8 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group z-[101]"
            aria-label="ClickUp Tools"
        >
            <BowArrow className="w-6 h-6 text-gray-900 dark:text-white group-hover:text-yellow-500 transition-colors" />
        </a>
    )
}
