
import { MusicBrowser } from "../components/music-browser";

export default function Home() {
  return (
    <section>
      <MusicBrowser />

      <p className="text-neutral-600 mt-8 text-left">
        Más canciones en{" "}
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
