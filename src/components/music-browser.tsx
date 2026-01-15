import { useState, useMemo, useEffect } from "react";
import { useVideos, Video } from "../contexts/video-context";
import { useLanguage } from "../contexts/language-context";
import { VideoForm } from "./video-form";
import VideoPlayerModal from "./VideoPlayerModal";
import { Search, SearchX, Plus, Pencil, Trash2, Hash, X, Check, Play } from "lucide-react";
import { LanguageSwitch } from "./language-switch";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableVideoItem({ id, children, disabled }: { id: string, children: React.ReactNode, disabled: boolean }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id, disabled });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.5 : 1,
        position: 'relative' as const,
        touchAction: 'none'
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow relative ${!disabled ? 'cursor-grab active:cursor-grabbing' : ''}`}
        >
            {children}
        </div>
    );
}

export function MusicBrowser() {
    const { videos, addVideo, updateVideo, deleteVideo, reorderVideos } = useVideos();
    const { t } = useLanguage();
    const [search, setSearch] = useState("");
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingVideo, setEditingVideo] = useState<Video | undefined>(undefined);
    const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [hiddenTags, setHiddenTags] = useState<string[]>([]);
    const [playlistUrl, setPlaylistUrl] = useState("https://youtube.com/playlist?list=PL-0_mv1k_D3IR4LDICAe3TZH4xqCX9xsr");
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Load hidden tags and playlist URL
    useEffect(() => {
        const updateConfig = () => {
            const savedTags = localStorage.getItem('config-hidden-tags');
            const savedUrl = localStorage.getItem('config-playlist-url');

            if (savedTags) {
                try {
                    setHiddenTags(JSON.parse(savedTags));
                } catch (e) {
                    setHiddenTags([]);
                }
            } else {
                setHiddenTags([]);
            }

            if (savedUrl) {
                setPlaylistUrl(savedUrl);
            }
        };
        updateConfig();
        window.addEventListener('config-update', updateConfig);
        return () => window.removeEventListener('config-update', updateConfig);
    }, []);

    // Filter tags to exclude hidden ones
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        videos.forEach(video => {
            video.tags.forEach(tag => {
                if (!hiddenTags.includes(tag)) {
                    tags.add(tag);
                }
            });
        });
        return Array.from(tags).sort();
    }, [videos, hiddenTags]);

    // Filter videos based on search, active tag, and hidden tags
    const filteredVideos = useMemo(() => {
        // First filter by hidden tags (hide song if all its tags are hidden? or if it matches a hidden tag?)
        // User said "ocultar tags y sus canciones".
        // Let's hide video if it has tags AND none of them are visible.
        const visibleVideos = videos.filter(video => {
            if (video.tags.length === 0) return true; // No tags = visible
            return video.tags.some(tag => !hiddenTags.includes(tag));
        });

        if (activeTag) {
            return visibleVideos.filter(video => video.tags.includes(activeTag));
        }

        if (!search.trim()) return visibleVideos;

        const lowerSearch = search.toLowerCase();
        return visibleVideos.filter(video =>
            video.name.toLowerCase().includes(lowerSearch) ||
            video.tags.some(tag => tag.toLowerCase().includes(lowerSearch))
        );
    }, [videos, search, activeTag, hiddenTags]);

    // Reset active tag if it becomes hidden
    useEffect(() => {
        if (activeTag && hiddenTags.includes(activeTag)) {
            setActiveTag(null);
        }
    }, [hiddenTags, activeTag]);

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

    const isReorderingAllowed = !search.trim() && !activeTag && hiddenTags.length === 0 && !isMobile;

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = videos.findIndex((v) => v.id === active.id);
            const newIndex = videos.findIndex((v) => v.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                reorderVideos(arrayMove(videos, oldIndex, newIndex));
            }
        }
    };

    return (
        <div className="space-y-8">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-white py-4 border-b border-neutral-200 space-y-3">
                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
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
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-300 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-[#6866D6] transition-all text-neutral-900"
                        />
                    </div>
                    <div className="hidden md:block">
                        <LanguageSwitch />
                    </div>
                </div>

                {activeTag && (
                    <div className="flex items-center cursor-pointer" onClick={() => setActiveTag(null)}>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#6866D6]/10 text-[#6866D6] rounded-full text-xs font-medium hover:bg-[#6866D6]/20 transition-colors">
                            <Hash className="w-3 h-3.5" />
                            {activeTag}
                            <button className="p-0 rounded-full transition-colors cursor-pointer">
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

            {/* Video Grid */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={filteredVideos.map(v => v.id)}
                    strategy={rectSortingStrategy}
                    disabled={!isReorderingAllowed}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-20">
                        {/* Add Video Button - Always First */}
                        <button
                            onClick={() => {
                                setEditingVideo(undefined);
                                setIsFormOpen(true);
                            }}
                            className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl hover:border-[#6866D6] hover:bg-[#6866D6]/10 transition-all group cursor-pointer ${filteredVideos.length === 0
                                ? 'md:col-start-2 min-h-[240px]'
                                : 'min-h-[220px]'
                                }`}
                        >
                            <div className="h-12 w-12 bg-[#6866D6]/20 text-[#6866D6] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                                <Plus className="w-6 h-6" />
                            </div>
                            <span className="font-medium text-gray-600 group-hover:text-[#6866D6] text-sm">{t('addSong')}</span>
                        </button>

                        {filteredVideos.length === 0 && !isFormOpen && (
                            <div className="col-span-full flex flex-col items-center justify-center py-6 text-neutral-500 space-y-2">
                                <div className="bg-neutral-100 p-3 rounded-full mb-2">
                                    <SearchX className="w-6 h-6 text-neutral-400" />
                                </div>
                                {search.trim() ? (
                                    <>
                                        <p className="font-bold text-neutral-900 dark:text-neutral-100">{t('noResultsFor')}</p>
                                        <p className="text-lg">"{search}"</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-bold text-neutral-900">{t('noSongsFound')}</p>
                                    </>
                                )}
                                <a
                                    href={playlistUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block mt-12 mb-0 text-center mx-auto max-w-lg !text-[#6866D6] hover:!text-[#5856b3] transition-colors group cursor-pointer"
                                >
                                    <p className="text-base group-hover:underline">
                                        {t('moreSongsIn')}{" "}
                                        <span className="break-all">
                                            {playlistUrl}
                                        </span>
                                    </p>
                                </a>
                            </div>
                        )}

                        {filteredVideos.map((video) => (
                            <SortableVideoItem
                                key={video.id}
                                id={video.id}
                                disabled={!isReorderingAllowed}
                            >
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
                                                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300">
                                                    <Play className="w-7 h-7 text-white fill-current ml-1" />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            {t('previewNotAvailable')}
                                        </div>
                                    )}
                                </div>

                                <div className="p-4">
                                    <h3
                                        className="font-semibold text-gray-900 truncate text-sm leading-tight group-hover:text-[#6866D6] transition-colors cursor-pointer"
                                        title={video.name}
                                        onClick={() => setPlayingVideo(video)}
                                    >
                                        {video.name}
                                    </h3>
                                    <div className="flex justify-between items-end mt-2 gap-2">
                                        <div className="flex flex-wrap gap-1">
                                            {video.tags.filter(t => !hiddenTags.includes(t)).map(tag => (
                                                <span
                                                    key={tag}
                                                    onClick={() => setActiveTag(tag)}
                                                    className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 cursor-pointer transition-colors relative z-20"
                                                >
                                                    #{getTagName(tag)}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0 relative z-20">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEdit(video);
                                                }}
                                                className="p-1.5 bg-gray-100 hover:bg-[#6866D6]/10 text-neutral-600 hover:text-[#6866D6] rounded-full transition-all cursor-pointer"
                                                title={t('edit')}
                                            >
                                                <Pencil size={12} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(video.id);
                                                }}
                                                className={`p-1.5 bg-gray-100 rounded-full transition-all cursor-pointer ${confirmDeleteId === video.id
                                                    ? "text-red-600 bg-red-50 hover:bg-red-100"
                                                    : "text-neutral-600 hover:text-red-600 hover:bg-red-50"
                                                    }`}
                                                title={confirmDeleteId === video.id ? t('confirmDelete') : t('delete')}
                                            >
                                                {confirmDeleteId === video.id ? <Check size={12} /> : <Trash2 size={12} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </SortableVideoItem>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {/* Video Form Modal */}
            <VideoForm
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingVideo(undefined);
                }}
                onSubmit={handleFormSubmit}
                initialData={editingVideo}
                initialName={search}
            />

            {playingVideo && (
                <VideoPlayerModal
                    video={playingVideo}
                    onClose={() => setPlayingVideo(null)}
                />
            )}
        </div>
    );
}
