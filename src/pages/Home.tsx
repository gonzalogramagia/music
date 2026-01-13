
import { MusicBrowser } from "../components/music-browser";
import { useLanguage } from "../contexts/language-context";
import { useState, useEffect } from "react";

export default function Home() {
  const { t } = useLanguage();
  const [playlistUrl, setPlaylistUrl] = useState("https://youtube.com/playlist?list=PL-0_mv1k_D3IR4LDICAe3TZH4xqCX9xsr");

  useEffect(() => {
    const updateUrl = () => {
      const saved = localStorage.getItem('config-playlist-url');
      if (saved) setPlaylistUrl(saved);
    };

    updateUrl();
    window.addEventListener('config-update', updateUrl);
    return () => window.removeEventListener('config-update', updateUrl);
  }, []);

  return (
    <section>
      <MusicBrowser />

      <p className="text-neutral-600 mt-8 text-left">
        {t('moreSongsIn')}{" "}
        <a
          href={playlistUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline break-all"
        >
          {playlistUrl}
        </a>
      </p>
    </section>
  );
}
