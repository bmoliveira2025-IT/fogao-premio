"use client";
import SkeletonCard from '@/components/SkeletonCard';

export default function Loading() {
    return (
        <div className="min-h-screen bg-[#050505] text-white px-4 pt-12 pb-32">
            <div className="max-w-2xl mx-auto space-y-6 mt-16">
                {[1, 2, 3, 4].map((i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        </div>
    );
}
