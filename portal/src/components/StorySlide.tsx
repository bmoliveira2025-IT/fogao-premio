"use client";

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StorySlideProps {
    isActive: boolean;
    children: ReactNode;
    backgroundImage?: string;
    type?: 'cover' | 'content' | 'news';
}

export default function StorySlide({ isActive, children, backgroundImage, type = 'content' }: StorySlideProps) {
    if (!isActive) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 w-full h-full flex flex-col"
        >
            {/* Background */}
            {backgroundImage && (
                <div className="absolute inset-0 z-0">
                    <img
                        src={backgroundImage}
                        alt="Background"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90" />
                </div>
            )}

            {/* Content Layer */}
            <div className="relative z-10 flex-1 flex flex-col p-6 pt-20 pb-12">
                {children}
            </div>
        </motion.div>
    );
}
