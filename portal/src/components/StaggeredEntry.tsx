"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StaggeredEntryProps {
    children: ReactNode;
    delay?: number;
    staggerDelay?: number;
    className?: string;
}

export default function StaggeredEntry({
    children,
    delay = 0,
    staggerDelay = 0.1,
    className = "",
}: StaggeredEntryProps) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay,
                delayChildren: delay,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20,
            },
        },
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className={className}
        >
            {Array.isArray(children) ? (
                children.map((child, index) => (
                    <motion.div key={index} variants={item}>
                        {child}
                    </motion.div>
                ))
            ) : (
                <motion.div variants={item}>{children}</motion.div>
            )}
        </motion.div>
    );
}
