"use client";

import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { doc, updateDoc, arrayUnion, arrayRemove, increment, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

interface LikeDislikeButtonsProps {
    articleId: string;
    initialLikes?: number;
    initialDislikes?: number;
    className?: string;
    variant?: 'compact' | 'full' | 'hero';
    onLike?: () => void;
    onDislike?: () => void;
    showPoints?: boolean;
}

export default function LikeDislikeButtons({
    articleId,
    initialLikes = 0,
    initialDislikes = 0,
    className = "",
    variant = "compact",
    onLike,
    onDislike,
    showPoints = false
}: LikeDislikeButtonsProps) {
    const { user } = useAuth();
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [likesCount, setLikesCount] = useState(initialLikes);
    const [dislikesCount, setDislikesCount] = useState(initialDislikes);
    const [recentLiker, setRecentLiker] = useState<any>(null);
    const [pointsAwarded, setPointsAwarded] = useState(false);

    useEffect(() => {
        if (!articleId) return;

        const newsRef = doc(db, "news", articleId);
        const unsubscribe = onSnapshot(newsRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setLikesCount(data.likes_count || 0);
                setDislikesCount(data.dislikes_count || 0);

                if (user) {
                    const likedBy = data.liked_by || [];
                    const dislikedBy = data.disliked_by || [];
                    setLiked(likedBy.includes(user.uid));
                    setDisliked(dislikedBy.includes(user.uid));
                }

                if (data.recent_likers && data.recent_likers.length > 0) {
                    setRecentLiker(data.recent_likers[data.recent_likers.length - 1]);
                } else {
                    setRecentLiker(null);
                }
            }
        });

        return () => unsubscribe();
    }, [articleId, user]);

    const handleAction = async (type: 'like' | 'dislike', e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user || !articleId) return;

        const newsRef = doc(db, "news", articleId);
        const userInitial = user.displayName ? user.displayName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : '?');

        try {
            if (type === 'like') {
                if (liked) {
                    await updateDoc(newsRef, {
                        likes_count: increment(-1),
                        liked_by: arrayRemove(user.uid),
                    });
                } else {
                    const updates: any = {
                        likes_count: increment(1),
                        liked_by: arrayUnion(user.uid),
                        recent_likers: arrayUnion({
                            uid: user.uid,
                            initial: userInitial,
                            name: user.displayName || user.email || 'Anônimo'
                        })
                    };
                    if (disliked) {
                        updates.dislikes_count = increment(-1);
                        updates.disliked_by = arrayRemove(user.uid);
                    }
                    await updateDoc(newsRef, updates);

                    if (onLike) onLike();
                    setPointsAwarded(true);
                }
            } else {
                if (disliked) {
                    await updateDoc(newsRef, {
                        dislikes_count: increment(-1),
                        disliked_by: arrayRemove(user.uid),
                    });
                } else {
                    const updates: any = {
                        dislikes_count: increment(1),
                        disliked_by: arrayUnion(user.uid),
                    };
                    if (liked) {
                        updates.likes_count = increment(-1);
                        updates.liked_by = arrayRemove(user.uid);
                    }
                    await updateDoc(newsRef, updates);
                    if (onDislike) onDislike();
                }
            }
        } catch (error) {
            console.error("Error updating action:", error);
        }
    };

    const isHero = variant === 'hero';
    const isFull = variant === 'full';

    // Size settings
    const iconSize = isHero ? 18 : 14;
    const buttonPadding = isHero ? "px-6 py-2.5" : (isFull ? "px-5 py-2.5" : "px-2.5 py-1.5");
    const textSize = isHero ? "text-sm" : "text-[11px]";

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {recentLiker && (
                <div className={`${isHero ? 'w-8 h-8' : 'w-6 h-6'} rounded-full bg-premium-gold flex items-center justify-center border border-background text-black font-black ${isHero ? 'text-xs' : 'text-[10px]'} shadow-sm`}>
                    {recentLiker.initial}
                </div>
            )}
            <div className={`flex items-center ${isHero ? 'bg-black/40' : (isFull ? 'bg-black/5 dark:bg-white/5 h-10' : 'bg-white/5')} backdrop-blur-sm border border-white/10 rounded-full overflow-hidden`}>
                <button
                    onClick={(e) => handleAction('like', e)}
                    className={`flex items-center gap-1.5 ${buttonPadding} transition-all active:scale-95 border-r border-white/10 h-full ${liked ? 'bg-premium-gold text-black' : 'text-zinc-400 hover:text-white'}`}
                >
                    <ThumbsUp size={iconSize} className={liked ? 'fill-current' : ''} />
                    <span className={`${textSize} font-athletic font-bold`}>{likesCount}</span>
                    {showPoints && !liked && !pointsAwarded && (
                        <span className="text-[10px] bg-premium-gold/20 text-premium-gold px-1.5 py-0.5 rounded-full font-black animate-pulse">+5</span>
                    )}
                </button>
                <button
                    onClick={(e) => handleAction('dislike', e)}
                    className={`flex items-center gap-1.5 ${buttonPadding} transition-all active:scale-95 h-full ${disliked ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                >
                    <ThumbsDown size={iconSize} className={disliked ? 'fill-current' : ''} />
                    <span className={`${textSize} font-athletic font-bold`}>{dislikesCount}</span>
                </button>
            </div>
        </div>
    );
}
