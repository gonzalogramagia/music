
import { MusicBrowser } from "../components/music-browser";
import { useLanguage } from "../contexts/language-context";

export default function Home() {
  const { t } = useLanguage();

  return (
    <section>
      <MusicBrowser />

      <p className="text-neutral-600 mt-8 text-left">
        {t('moreSongsIn')}{" "}
        <a
          href="https://youtube.com/playlist?list=PL-0_mv1k_D3IR4LDICAe3TZH4xqCX9xsr"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          https://youtube.com/playlist?list=PL-0_mv1k_D3IR4LDICAe3TZH4xqCX9xsr
        </a>
      </p>
    </section>
  );
}
