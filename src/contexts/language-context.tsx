import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useLocation } from "react-router-dom";

type Language = "es" | "en";

interface LanguageContextType {
  language: Language;
  mode: "music" | "study";
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
      searchSuffix: " Music",
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
      searchSuffix: " Music",
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
      editSong: "Editar Clase",
      name: "Nombre de la Clase",
      namePlaceholder: "Ej: Introducción a React",
      searchPlaceholder: "Buscar clases...",
      noSongsFound: "No se encontraron clases",
      toastSongAdded: "Clase agregada a la biblioteca",
      toastSongUpdated: "Clase actualizada correctamente",
      moreSongsIn: "Más material de estudio en",
      playlistUrlLabel: 'URL de "Más material de estudio en..."',
      tagsPlaceholder: "Programación, Ciberseguridad, Hardware",
      headline_part1: "¡Tu material de estudio",
      headline_part2: "al instante!",
      searchSuffix: "",
    },
    en: {
      addSong: "Add Class",
      editSong: "Edit Class",
      name: "Class Name",
      namePlaceholder: "Ex: Intro to React",
      searchPlaceholder: "Search classes...",
      noSongsFound: "No classes found",
      toastSongAdded: "Class added to library",
      toastSongUpdated: "Class updated successfully",
      moreSongsIn: "More study material at",
      playlistUrlLabel: '"More study material at..." URL',
      tagsPlaceholder: "Programming, Cybersecurity, Hardware",
      headline_part1: "Your study material",
      headline_part2: "in a flash!",
      searchSuffix: "",
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

  const t = useCallback(
    (key: string) => {
      const base = translations[language] || {};
      const overrides = mode === "study" ? studyOverrides[language] || {} : {};
      return (overrides[key] ?? base[key]) || key;
    },
    [language, mode]
  );

  useEffect(() => {
    const isStudy = mode === "study";
    const title = isStudy ? "💻 😎 📚" : "♪♫♪♫";

    // Metadata always in English as requested
    const enBase = translations.en;
    const enStudy = studyOverrides.en;

    const headline1 = isStudy ? enStudy.headline_part1 : enBase.headline_part1;
    const headline2 = isStudy ? enStudy.headline_part2 : enBase.headline_part2;
    const modeSuffix = isStudy ? " | Study Mode 📚" : " | Music Mode 🎵";
    const description = `${headline1} ${headline2}${modeSuffix}`;

    const image = isStudy ? "/studying.png" : "/dj.png";
    const fullImageUrl = `https://bien.estate${image}`;

    document.title = title;

    const updateMeta = (
      selector: string,
      content: string,
      attr: string = "content"
    ) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attr, content);
    };

    updateMeta('meta[property="og:url"]', "https://bien.estate/en");
    updateMeta('meta[property="twitter:url"]', "https://bien.estate/en");
    updateMeta('meta[name="description"]', description);
    updateMeta('meta[property="og:title"]', title);
    updateMeta('meta[property="og:description"]', description);
    updateMeta('meta[property="og:image"]', fullImageUrl);
    updateMeta('meta[property="twitter:title"]', title);
    updateMeta('meta[property="twitter:description"]', description);
    updateMeta('meta[property="twitter:image"]', fullImageUrl);
  }, [mode]); // No longer depends on language or t, as it's always English

  return (
    <LanguageContext.Provider value={{ language, mode, t, setLanguage }}>
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
