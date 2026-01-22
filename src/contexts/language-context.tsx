import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

type Language = "es" | "en";

interface LanguageContextType {
  language: Language;
  t: (key: string) => string;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [language, setLanguage] = useState<Language>("es");
  const [mode, setMode] = useState<"music" | "study">(() => {
    try {
      return localStorage.getItem("config-interface-mode") === "study"
        ? "study"
        : "music";
    } catch (e) {
      return "music";
    }
  });

  useEffect(() => {
    if (location.pathname.startsWith("/en")) {
      setLanguage("en");
    } else if (
      location.pathname === "/import" ||
      location.pathname === "/export"
    ) {
      setLanguage("en");
    } else if (
      location.pathname === "/importar" ||
      location.pathname === "/exportar"
    ) {
      setLanguage("es");
    } else {
      setLanguage("es");
    }
  }, [location]);

  const translations: Record<Language, Record<string, string>> = {
    es: {
      ariaHome: "Ir a Today",
      ariaEmojis: "Ir a Emojis",
      ariaMusic: "Ya estás acá!",
      ariaTraining: "Ir a Jugar",
      tag_Electronic: "Electrónica",
      tag_Rap: "Rap",
      tag_Focus: "Enfoque",
      tag_Programming: "Programación",
      tag_Code: "Programación",
      tag_Cybersecurity: "Ciberseguridad",
      tag_Hardware: "Hardware",
      moreSongsIn: "Más canciones en",
      playlistUrlLabel: 'URL de "Más canciones en..."',
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
      headline_part1: "¡Tu banda sonora perfecta",
      headline_part2: "al instante!",
      interfaceMode: "Actualizar Interfaz",
      studyInterface: "Modo de Estudio",
      interfaceDesc: "Cambia logo, título y links por defecto",
      on: "ON",
      off: "OFF",
    },
    en: {
      ariaHome: "Go to Today",
      ariaEmojis: "Go to Emojis",
      ariaMusic: "You are here!",
      ariaTraining: "Go Play",
      tag_Electronic: "Electronic",
      tag_Rap: "Rap",
      tag_Focus: "Focus",
      tag_Programming: "Programming",
      tag_Code: "Programming",
      tag_Cybersecurity: "Cybersecurity",
      tag_Hardware: "Hardware",
      moreSongsIn: "More songs on",
      playlistUrlLabel: '"More songs on..." URL',
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
      headline_part1: "Your perfect soundtrack",
      headline_part2: "in a flash!",
      interfaceMode: "Update Interface",
      studyInterface: "Study Mode",
      interfaceDesc: "Change logo, title and default links",
      on: "ON",
      off: "OFF",
    },
  };

  const studyOverrides: Record<Language, Record<string, string>> = {
    es: {
      addSong: "Agregar Clase",
      searchPlaceholder: "Buscar clases...",
      moreSongsIn: "Más material de estudio en",
      playlistUrlLabel: 'URL de "Más material de estudio en..."',
      tagsPlaceholder: "Programming, Cybersecurity, Hardware",
      headline_part1: "¡Tu material de estudio",
      headline_part2: "al instante!",
    },
    en: {
      addSong: "Add Class",
      searchPlaceholder: "Search classes...",
      moreSongsIn: "More study material at",
      playlistUrlLabel: '"More study material at..." URL',
      tagsPlaceholder: "Programming, Cybersecurity, Hardware",
      headline_part1: "Your study material",
      headline_part2: "in a flash!",
    },
  };

  useEffect(() => {
    const onConfig = () => {
      try {
        setMode(
          localStorage.getItem("config-interface-mode") === "study"
            ? "study"
            : "music"
        );
      } catch (e) {
        setMode("music");
      }
    };
    window.addEventListener("config-update", onConfig);
    return () => window.removeEventListener("config-update", onConfig);
  }, []);

  const t = (key: string) => {
    const base = translations[language] || {};
    const overrides = mode === "study" ? studyOverrides[language] || {} : {};
    return (overrides[key] ?? base[key]) || key;
  };

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
