
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
    getEmbedUrl: (url: string) => string | undefined;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

const STORAGE_KEY = 'gonzalogramagia_music_videos';

const getEmbedUrl = (url: string): string | undefined => {
    try {
        let videoId = '';
        if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('v=')[1].split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
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
        const storedVideos = localStorage.getItem(STORAGE_KEY);
        if (storedVideos) {
            try {
                setVideos(JSON.parse(storedVideos));
            } catch (e) {
                console.error('Failed to parse videos from local storage', e);
            }
        }
    }, []);

    const saveVideos = (newVideos: Video[]) => {
        setVideos(newVideos);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newVideos));
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

    return (
        <VideoContext.Provider value={{ videos, addVideo, updateVideo, deleteVideo, getEmbedUrl }}>
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
