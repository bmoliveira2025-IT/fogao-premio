"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { getSafeImageSrc } from '@/lib/images';
import SourceIcon from './SourceIcon';

interface HighlightArticle {
    id: string;
    title: string;
    image?: string;
    source?: string;
    created_at: string;
}

function timeAgo(dateString: string) {
    const elapsedSeconds = Math.max(0, Math.floor((Date.now() - new Date(dateString).getTime()) / 1000));
    if (elapsedSeconds < 3600) return `${Math.max(1, Math.floor(elapsedSeconds / 60))} min atrás`;
    if (elapsedSeconds < 86400) return `${Math.floor(elapsedSeconds / 3600)}h atrás`;
    const days = Math.floor(elapsedSeconds / 86400);
    return `${days} ${days === 1 ? 'dia' : 'dias'} atrás`;
}

export default function HighlightNewsCarousel({ news }: { news: HighlightArticle[] }) {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const highlights = news.slice(0, 5);

    if (highlights.length === 0) return null;

    const updateActiveCard = () => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        const cards = Array.from(carousel.children) as HTMLElement[];
        const carouselCenter = carousel.scrollLeft + carousel.clientWidth / 2;
        const closestIndex = cards.reduce((closest, card, index) => {
            const cardCenter = card.offsetLeft + card.offsetWidth / 2;
            const closestCard = cards[closest];
            const closestCenter = closestCard.offsetLeft + closestCard.offsetWidth / 2;
            return Math.abs(cardCenter - carouselCenter) < Math.abs(closestCenter - carouselCenter)
                ? index
                : closest;
        }, 0);

        setActiveIndex(closestIndex);
    };

    const goToCard = (index: number) => {
        const card = carouselRef.current?.children[index] as HTMLElement | undefined;
        card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        setActiveIndex(index);
    };

    return (
        <section aria-label="Notícias em destaque" className="mb-5">
            <div
                ref={carouselRef}
                onScroll={updateActiveCard}
                className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-4 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {highlights.map((article, index) => (
                    <Link
                        key={article.id}
                        href={`/news/${article.id}`}
                        className="group relative isolate min-w-[86%] sm:min-w-[72%] aspect-[4/5] max-h-[540px] snap-center overflow-hidden rounded-[28px] bg-zinc-900 shadow-[0_12px_32px_rgba(0,0,0,0.16)]"
                    >
                        <Image
                            src={getSafeImageSrc(article.image, 'https://placehold.co/800x1000')}
                            alt=""
                            fill
                            priority={index === 0}
                            sizes="(max-width: 640px) 86vw, 72vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-black/5" />

                        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/20 bg-black/65 px-3 py-1.5 text-white shadow-sm backdrop-blur-md">
                            <SourceIcon source={article.source} className="h-4 w-4 rounded-full" />
                            <span className="max-w-[170px] truncate text-[11px] font-bold">
                                {article.source || 'Fogão Prêmio'}
                            </span>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 p-5 pb-6 text-white">
                            <span className="mb-2 inline-block text-[10px] font-extrabold uppercase tracking-[0.14em] text-amber-400">
                                Destaque {index + 1}
                            </span>
                            <h2 className="line-clamp-3 text-[24px] font-extrabold leading-[1.12] tracking-[-0.02em] drop-shadow-md sm:text-3xl">
                                {article.title.replace(/\*\*/g, '').trim()}
                            </h2>
                            <p className="mt-3 text-[13px] font-medium text-white/75">
                                {article.source || 'Fogão Prêmio'} <span aria-hidden="true">•</span> {timeAgo(article.created_at)}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {highlights.length > 1 && (
                <div className="mt-2 flex items-center justify-center gap-1.5" aria-label="Selecionar destaque">
                    {highlights.map((article, index) => (
                        <button
                            key={article.id}
                            type="button"
                            aria-label={`Ir para destaque ${index + 1}`}
                            aria-current={activeIndex === index ? 'true' : undefined}
                            onClick={() => goToCard(index)}
                            className={`h-1.5 rounded-full transition-all ${activeIndex === index ? 'w-6 bg-zinc-900' : 'w-1.5 bg-zinc-300'}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
