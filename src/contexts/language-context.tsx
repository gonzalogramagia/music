import { createContext, useContext, ReactNode, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

type Language = 'es' | 'en'

interface LanguageContextType {
    language: Language
    t: (key: string) => string
    setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
    const location = useLocation()
    const [language, setLanguage] = useState<Language>('es')

    useEffect(() => {
        if (location.pathname.startsWith('/en')) {
            setLanguage('en')
        } else if (location.pathname === '/import' || location.pathname === '/export') {
            setLanguage('en')
        } else if (location.pathname === '/importar' || location.pathname === '/exportar') {
            setLanguage('es')
        } else {
            setLanguage('es')
        }
    }, [location])

    const translations: Record<Language, Record<string, string>> = {
        es: {
            ariaHome: "Ir a Today",
            ariaEmojis: "Ir a Emojis",
            ariaMusic: "Ya estás acá!",
            ariaTraining: "Andá a Entrenar!",
            tag_Electronic: "Electrónica",
            moreSongsIn: "Más canciones en",
            searchPlaceholder: "Buscar canciones...",
            addSong: "Agregar Canción",
            noSongsFound: "No se encontraron canciones",
            noResultsFor: "No se encontraron resultados para",
            edit: "Editar",
            delete: "Eliminar",
            confirmDelete: "Confirmar eliminar",
            editSong: "Editar Canción",
            youtubeUrl: "URL de YouTube",
            name: "Nombre",
            namePlaceholder: "Ej: Mi Canción Favorita",
            searchInYoutube: "Buscar en YouTube",
            tagsLabel: "Tags (separados por coma)",
            tagsPlaceholder: "Rap, Electrónica, Motivación, Energía",
            saveChanges: "Guardar Cambios",
            previewNotAvailable: "Vista previa no disponible",
            toastSongAdded: "Canción agregada a la biblioteca",
            toastSongUpdated: "Canción actualizada correctamente",
        },
        en: {
            ariaHome: "Go to Today",
            ariaEmojis: "Go to Emojis",
            ariaMusic: "You are here!",
            ariaTraining: "Go Work out!",
            tag_Electronic: "Electronic",
            moreSongsIn: "More songs on",
            searchPlaceholder: "Search songs...",
            addSong: "Add Song",
            noSongsFound: "No songs found",
            noResultsFor: "No results for",
            edit: "Edit",
            delete: "Delete",
            confirmDelete: "Confirm delete",
            editSong: "Edit Song",
            youtubeUrl: "YouTube URL",
            name: "Name",
            namePlaceholder: "Ex: My Favorite Song",
            searchInYoutube: "Search in YouTube",
            tagsLabel: "Tags (comma separated)",
            tagsPlaceholder: "Rap, Electronic, Motivation, Energy",
            saveChanges: "Save Changes",
            previewNotAvailable: "No preview available",
            clickButtonToAdd: "Click the button above to add one",
            toastSongAdded: "Song added to library",
            toastSongUpdated: "Song updated successfully",
        }
    }

    const t = (key: string) => {
        return translations[language][key] || key
    }

    return (
        <LanguageContext.Provider value={{ language, t, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}
