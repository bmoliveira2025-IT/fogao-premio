"use client";

import Image from 'next/image';
import { Play } from 'lucide-react';
import { getSafeImageSrc } from '@/lib/images';

export default function ModernVideoCard({ video, overrideTitle }: { video?: any, overrideTitle?: string }) {
    // Default mock data if needed for display purposes or fallback
    const title = overrideTitle || video?.title || "Vídeo Destaque da Glorioso TV";
    const thumbnail = video?.thumbnail || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1935&auto=format&fit=crop";

    return (
        <div className="px-3 md:px-0 mb-4 mt-2">
        <div className="px-3 md:px-0 mb-4 mt-2">
            <div className="relative block w-full overflow-hidden bg-[#151515] rounded-xl shadow-[0_4px_25px_rgba(0,0,0,0.8)] border border-white/5 cursor-pointer group">
                
                {/* Header Title Block - Matches Screenshot (black bar integrated into card) */}
                <div className="bg-[#111] px-4 md:px-5 py-3 md:py-4 border-b border-white/5 relative z-20 shadow-md">
                    <h2 className="text-[13px] md:text-base font-bold text-white tracking-wide leading-snug line-clamp-2">
                        <span className="font-black text-white">Vídeo:</span> {title.replace(/^Vídeo:\s*/i, '')}
                    </h2>
                </div>

                {/* Video Image Content Area */}
                <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
                    <Image
                        src={getSafeImageSrc(thumbnail)}
                        alt={title}
                        fill
                        className="object-cover object-center opacity-80 transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        unoptimized
                    />
                    
                    {/* Gradient from bottom for image blending effect */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* The Play Button overlay container */}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300 flex items-end justify-end p-4 md:p-6 pb-2">
                        {/* Action Play Button - Custom Red Rounded Rect from new screenshot */}
                        <div className="relative z-30">
                            {/* Inner semi-transparent border effect seen in screenshot floating around button */}
                            <div className="absolute -inset-1.5 border border-white/10 rounded-2xl group-hover:border-white/20 transition-colors opacity-0 group-hover:opacity-100" />
                            
                            <div className="bg-[#cc141c] hover:bg-[#db1720] transition-colors rounded-3xl md:rounded-[24px] shadow-[0_8px_30px_rgba(204,20,28,0.5)] border border-white/20 flex items-center justify-center w-[72px] h-[54px] md:w-[90px] md:h-[68px] group-hover:scale-105 active:scale-[0.98]">
                                <div className="w-0 h-0 border-y-[10px] md:border-y-[13px] border-y-transparent border-l-[16px] md:border-l-[22px] border-l-white transition-all ml-1.5"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}
