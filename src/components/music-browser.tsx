
import { useState, useMemo } from "react";
import { useVideos, Video } from "../contexts/video-context";
import { useLanguage } from "../contexts/language-context";
import { VideoForm } from "./video-form";
import VideoPlayerModal from "./VideoPlayerModal";
import { SearchX, Plus, Pencil, Trash2, Hash, X, Check } from "lucide-react";

import { LanguageSwitch } from "./language-switch";

export function MusicBrowser() {
    const { videos, addVideo, updateVideo, deleteVideo } = useVideos();
    const { t } = useLanguage();
    const [search, setSearch] = useState("");
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingVideo, setEditingVideo] = useState<Video | undefined>(undefined);
    const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        videos.forEach(video => {
            video.tags.forEach(tag => tags.add(tag));
        });
        return Array.from(tags).sort();
    }, [videos]);

    const filteredVideos = useMemo(() => {
        if (activeTag) {
            return videos.filter(video => video.tags.includes(activeTag));
        }

        if (!search.trim()) return videos;

        const lowerSearch = search.toLowerCase();
        return videos.filter(video =>
            video.name.toLowerCase().includes(lowerSearch) ||
            video.tags.some(tag => tag.toLowerCase().includes(lowerSearch))
        );
    }, [videos, search, activeTag]);

    const handleEdit = (video: Video) => {
        setEditingVideo(video);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirmDeleteId === id) {
            deleteVideo(id);
            setConfirmDeleteId(null);
        } else {
            setConfirmDeleteId(id);
            // Auto-reset confirmation after 3 seconds
            setTimeout(() => setConfirmDeleteId(null), 3000);
        }
    };

    const handleFormSubmit = (videoData: Omit<Video, 'id' | 'embedUrl'>) => {
        if (editingVideo) {
            updateVideo(editingVideo.id, videoData);
        } else {
            addVideo(videoData);
        }
    };

    const handleUnpinTag = () => setActiveTag(null);

    const getTagName = (tag: string) => {
        const key = 'tag_' + tag;
        const translation = t(key);
        return translation === key ? tag : translation;
    };

    return (
        <div className="space-y-8">
            <div className="sticky top-0 z-10 bg-white py-4 border-b border-neutral-200 space-y-3">
                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onFocus={() => {
                                if (activeTag) {
                                    handleUnpinTag();
                                }
                            }}
                            className="w-full px-4 py-2 rounded-lg border border-neutral-300 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-neutral-900"
                        />
                    </div>
                    <LanguageSwitch />
                </div>

                {activeTag && (
                    <div className="flex items-center cursor-pointer" onClick={() => setActiveTag(null)}>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors">
                            <Hash className="w-3.5 h-3.5" />
                            {activeTag}
                            <button className="ml-1 p-0.5 rounded-full transition-colors cursor-pointer">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </span>
                    </div>
                )}

                {/* Tag Cloud */}
                {allTags.length > 0 && !activeTag && (
                    <div className="flex flex-wrap gap-2">
                        {allTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setActiveTag(tag)}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded text-xs transition-colors cursor-pointer"
                            >
                                <Hash className="w-3 h-3" />
                                {getTagName(tag)}
                            </button>
                        ))}
                    </div>
                )}
            </div>



            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {/* Add Video Button - Always First */}
                <button
                    onClick={() => {
                        setEditingVideo(undefined);
                        setIsFormOpen(true);
                    }}
                    className="flex flex-col items-center justify-center min-h-[220px] border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group cursor-pointer"
                >
                    <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                        <Plus className="w-6 h-6" />
                    </div>
                    <span className="font-medium text-gray-600 group-hover:text-blue-600 text-sm">{t('addSong')}</span>
                </button>



                {filteredVideos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[220px] p-6 text-neutral-500 space-y-2 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        <div className="bg-neutral-100 p-3 rounded-full">
                            <SearchX className="w-6 h-6 text-neutral-400" />
                        </div>
                        <div className="text-center text-neutral-500">
                            <p className="font-bold text-sm">
                                {t('noSongsFound')}
                            </p>
                        </div>
                    </div>
                ) : (
                    filteredVideos.map((video) => (
                        <div key={video.id} className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow relative">
                            <div className="aspect-video bg-gray-100 relative group-hover:scale-105 transition-transform duration-300">
                                {video.url ? (
                                    <div
                                        onClick={() => setPlayingVideo(video)}
                                        className="block w-full h-full relative cursor-pointer"
                                    >
                                        <img
                                            src={`https://img.youtube.com/vi/${video.url.split('v=')[1]?.split('&')[0] || video.url.split('youtu.be/')[1]?.split('?')[0]}/hqdefault.jpg`}
                                            alt={video.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                                            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300">
                                                <svg className="w-9 h-9 text-neutral-900" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        {t('previewNotAvailable')}
                                    </div>
                                )}

                            </div>

                            {/* Action Buttons - Bottom Right of Card */}
                            <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 p-1.5 rounded-lg border border-gray-100 shadow-sm backdrop-blur-sm z-10">
                                <button
                                    onClick={() => handleEdit(video)}
                                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                                    title={t('edit')}
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(video.id)}
                                    className={`p-2 transition-colors cursor-pointer ${confirmDeleteId === video.id
                                        ? "text-red-500 hover:text-red-600 bg-red-50 rounded-lg"
                                        : "text-gray-500 hover:text-red-500"
                                        }`}
                                    title={confirmDeleteId === video.id ? t('confirmDelete') : t('delete')}
                                >
                                    {confirmDeleteId === video.id ? (
                                        <Check className="w-4 h-4" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                </button>
                            </div>

                            <div className="p-2">
                                <h3 className="font-semibold text-gray-900 truncate text-sm leading-tight" title={video.name}>
                                    {video.name}
                                </h3>


                                <div className="flex flex-wrap gap-1 mt-1">
                                    {video.tags.map(tag => (
                                        <span
                                            key={tag}
                                            onClick={() => setActiveTag(tag)}
                                            className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
                                        >
                                            #{getTagName(tag)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>



            <VideoForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={editingVideo}
            />

            {playingVideo && (
                <VideoPlayerModal
                    video={playingVideo}
                    onClose={() => setPlayingVideo(null)}
                />
            )}
        </div >
    );
}
