# 🎵 Music

**A personal video manager to index, organize, and play your favorite YouTube music videos.**

"Music" is designed to be your go-to tool for curating your personal playlist. With instant search, tagging, and embedded playback, it helps you keep your favorite songs just a click away.

---

## ✨ Key Features

- **🔎 Smart Search**: Find songs by:
    - Name (e.g., "Bohemian Rhapsody")
    - Tags (e.g., #Rock, #Live)
- **🔃 Drag & Drop**: Organize your playlist your way by dragging and dropping cards.
- **🌍 Internationalization**: Fully localized interface with English (EN) and Spanish (ES) support.
- **▶️ In-App Playback**: Watch videos instantly in a sleek modal without leaving the app.
- **⚡️ Rapid Add**: Auto-fetch video titles from YouTube URLs.
- **🏷️ Tagging System**: Organize your library with custom tags.
- **💾 Data Management**: 
    - **Export**: Backup your library or share specific tags via JSON.
    - **Import**: Restore your collection easily.
- **🎨 Clean UI**: Minimalist design with a focus on music.

---

## 🛠️ Technology Stack

- **Framework**: [Vite](https://vitejs.dev/) + [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

This section is for reference — you don't need to be a developer to use the app.

---

## 🕹 Usage

### 🌐 Switching language
- Use the ES / EN switch next to the search bar to toggle the interface language.

### ➕ Adding items
- Click the large "Add" card to create a new entry.
- Paste a YouTube URL — the app will fetch the title automatically when possible.
- Add one or more tags to organize your library (e.g. Code, Hardware, Focus).

### 🔎 Finding content
- Use the search bar to find items by name.
- Click a tag in the tag cloud to filter the list to that category.

### ▶️ Listening / Watching
- Click the thumbnail on a card to open an embedded player and watch the video without leaving the app.

### 🧭 Quick navigation
- The top area includes quick controls (language, search, add).

### ⚙️ Configuration & Backup
- Open the Wrench icon to access settings:
    - Set a default playlist/link for the footer.
    - Hide tags you don't want to see.
    - Import and export collections as JSON. Exported files are prefixed with the current mode (e.g. `music-...` or `study-...`).

All changes are stored in your browser — no account required.

---

## 🧑‍🏫 Study interface (new)

Switch to Study mode for a learning-first experience: a refreshed logo, a study-focused headline, and curated default content that helps you concentrate.

- How to enable
    - Open Settings (wrench) → "Actualizar Interfaz." Toggle ON to activate Study mode.

- What changes
    - The app shows a study-oriented logo and headline.
    - A separate default collection of study videos is loaded (examples: Competitive Programming, Cybersecurity, Hardware tutorials).
    - Study tags include: Code, Cybersecurity, Hardware.

- Per-mode behavior
    - Settings like the footer playlist URL and hidden-tags are stored per mode, so music and study configurations remain separate.
    - Exported backups include the active mode in the filename (`music-...` or `study-...`).

Enjoy switching between vibes — music when you want to relax, study when you want to focus.


---

## 📄 License

This project is created for personal use and is shared as-is. Feel free to explore and modify it!

---

Made with 💛 by [Gonza](https://github.com/gonzalogramagia)
