import Home from './pages/Home'
import Footer from './components/footer'
import { ClickupLink } from './components/clickup-link'
import { Github } from 'lucide-react'

function AppContent() {
    return (
        <div className="max-w-4xl mx-4 mt-8 lg:mx-auto">
            <main className="flex-auto min-w-0 mt-6 flex flex-col px-8 lg:px-0">
                <Home />
                <Footer />
                <ClickupLink />
            </main>

            <a
                href="https://github.com/gonzalogramagia/music"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-8 right-8 p-3 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group z-50 flex items-center justify-center"
                aria-label="GitHub Repository"
            >
                <Github className="w-6 h-6 text-gray-900 group-hover:text-blue-500 transition-colors" />
            </a>
        </div>
    );
}

import { VideoProvider } from './contexts/video-context'

function App() {
    return (
        <VideoProvider>
            <AppContent />
        </VideoProvider>
    )
}

export default App
