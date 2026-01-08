import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ChevronRight, Clock } from 'lucide-react';

export default function SkeletonCard() {
    return (
        <div className="bg-[#121212] rounded-2xl overflow-hidden mb-6 border border-premium-gold/15 h-[320px] md:h-52 md:flex">
            {/* Image Skeleton */}
            <div className="h-48 md:h-full md:w-1/3 shimmer relative" />

            {/* Content Skeleton */}
            <div className="p-5 md:w-2/3 flex flex-col justify-between">
                <div>
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-6 h-6 rounded-full shimmer" />
                        <div className="h-3 w-16 rounded shimmer" />
                    </div>
                    <div className="space-y-2 mb-4">
                        <div className="h-5 w-full rounded shimmer" />
                        <div className="h-5 w-3/4 rounded shimmer" />
                    </div>
                    <div className="space-y-1">
                        <div className="h-2 w-full rounded shimmer" />
                        <div className="h-2 w-5/6 rounded shimmer" />
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <div className="h-3 w-20 rounded shimmer" />
                </div>
            </div>
        </div>
    );
}
