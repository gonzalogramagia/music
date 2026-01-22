
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Video {
    id: string;
    name: string;
    url: string; // YouTube URL
    tags: string[];
    embedUrl?: string; // Calculated field for iframe
}

interface VideoContextType {
    videos: Video[];
    addVideo: (video: Omit<Video, 'id' | 'embedUrl'>) => void;
    updateVideo: (id: string, video: Omit<Video, 'id' | 'embedUrl'>) => void;
    deleteVideo: (id: string) => void;
    reorderVideos: (newOrder: Video[]) => void;
    getEmbedUrl: (url: string) => string | undefined;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

const STORAGE_KEY_BASE = 'gonzalogramagia_music_videos';

const getMode = () => {
    try {
        const m = localStorage.getItem('config-interface-mode');
        return m === 'study' ? 'study' : 'music';
    } catch (e) {
        return 'music';
    }
};

const STORAGE_KEY = () => `${STORAGE_KEY_BASE}_${getMode()}`;

const getEmbedUrl = (url: string): string | undefined => {
    try {
        let videoId = '';
        if (url.includes('youtube.com/watch')) {
            const urlObj = new URL(url);
            videoId = urlObj.searchParams.get('v') || '';
        } else if (url.includes('youtu.be/')) {
            // Handle https://youtu.be/ID?t=123
            const parts = url.split('youtu.be/');
            if (parts.length > 1) {
                videoId = parts[1].split('?')[0];
            }
        }

        // Final sanity check for weird inputs like https://youtu.be/watch?v=ID which shouldn't happen but user had it
        if (!videoId && url.includes('v=')) {
            try {
                const urlObj = new URL(url);
                videoId = urlObj.searchParams.get('v') || '';
            } catch (e) { }
        }


        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
    } catch (e) {
        console.error('Error parsing YouTube URL', e);
    }
    return undefined;
};

export const VideoProvider = ({ children }: { children: ReactNode }) => {
    const [videos, setVideos] = useState<Video[]>([]);

    useEffect(() => {
        const loadVideosForMode = () => {
            const mode = getMode();

            const defaultMusic: Video[] = [
                {
                    id: 'default-song',
                    name: 'Lost Frequencies – Royal Palace Brussels 2020',
                    url: 'https://youtu.be/q-ktd4nEi3w',
                    tags: ['Electronic'],
                    embedUrl: getEmbedUrl('https://youtu.be/q-ktd4nEi3w')
                },
                {
                    id: 'default-song-2',
                    name: 'Paulo Londra - 1% (feat. Eladio Carrión) [Official Video]',
                    url: 'https://youtu.be/2yGZPCjtGJ8',
                    tags: ['Rap'],
                    embedUrl: getEmbedUrl('https://youtu.be/2yGZPCjtGJ8')
                },
                {
                    id: 'default-song-3',
                    name: 'Zero Distractions - Chillstep Mix for Full Focus',
                    url: 'https://www.youtube.com/watch?v=hbPoX4vjB5o',
                    tags: ['Focus'],
                    embedUrl: getEmbedUrl('https://www.youtube.com/watch?v=hbPoX4vjB5o')
                }
            ];

            const defaultStudy: Video[] = [
                {
                    id: 'study-1',
                    name: 'How to start Competitive Programming? For beginners!',
                    url: 'https://youtu.be/xAeiXy8-9Y8',
                    tags: ['Code'],
                    embedUrl: getEmbedUrl('https://youtu.be/xAeiXy8-9Y8')
                },
                {
                    id: 'study-2',
                    name: "the hacker’s roadmap (how to get started in IT in 2025)",
                    url: 'https://youtu.be/5xWnmUEi1Qw',
                    tags: ['Cybersecurity'],
                    embedUrl: getEmbedUrl('https://youtu.be/5xWnmUEi1Qw')
                },
                {
                    id: 'study-3',
                    name: 'How does Computer Hardware Work? 💻🛠🔬 [3D Animated Teardown]',
                    url: 'https://youtu.be/d86ws7mQYIg',
                    tags: ['Hardware'],
                    embedUrl: getEmbedUrl('https://youtu.be/d86ws7mQYIg')
                }
            ];

            const key = STORAGE_KEY();
            const stored = localStorage.getItem(key);
            if (stored) {
                try {
                    const parsed: Video[] = JSON.parse(stored);
                    setVideos(parsed);
                    return;
                } catch (e) {
                    console.error('Failed to parse videos from local storage', e);
                }
            }

            const defaults = mode === 'study' ? defaultStudy : defaultMusic;
            setVideos(defaults);
            localStorage.setItem(key, JSON.stringify(defaults));
        };

        loadVideosForMode();

        const onConfigUpdate = () => loadVideosForMode();
        window.addEventListener('config-update', onConfigUpdate);
        return () => window.removeEventListener('config-update', onConfigUpdate);
    }, []);

    const saveVideos = (newVideos: Video[]) => {
        setVideos(newVideos);
        localStorage.setItem(STORAGE_KEY(), JSON.stringify(newVideos));
    };

    const addVideo = (videoData: Omit<Video, 'id' | 'embedUrl'>) => {
        const newVideo: Video = {
            ...videoData,
            id: uuidv4(),
            embedUrl: getEmbedUrl(videoData.url)
        };
        saveVideos([...videos, newVideo]);
    };

    const updateVideo = (id: string, videoData: Omit<Video, 'id' | 'embedUrl'>) => {
        const updatedVideos = videos.map(video =>
            video.id === id
                ? { ...video, ...videoData, embedUrl: getEmbedUrl(videoData.url) }
                : video
        );
        saveVideos(updatedVideos);
    };

    const deleteVideo = (id: string) => {
        const filteredVideos = videos.filter(video => video.id !== id);
        saveVideos(filteredVideos);
    };

    const reorderVideos = (newOrder: Video[]) => {
        saveVideos(newOrder);
    };

    return (
        <VideoContext.Provider value={{ videos, addVideo, updateVideo, deleteVideo, reorderVideos, getEmbedUrl }}>
            {children}
        </VideoContext.Provider>
    );
};

export const useVideos = () => {
    const context = useContext(VideoContext);
    if (!context) {
        throw new Error('useVideos must be used within a VideoProvider');
    }
    return context;
};
