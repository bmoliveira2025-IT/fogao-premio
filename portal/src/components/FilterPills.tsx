"use client";
import React, { useState } from 'react';

const filters = ["TUDO", "REFORÇOS", "JOGOS", "BASTIDORES", "FOGÃONET", "GLOBO ESPORTE"];

export default function FilterPills() {
    const [active, setActive] = useState("TUDO");

    return (
        <div className="w-full overflow-x-auto pb-4 pt-2 scrollbar-hide pl-4">
            <div className="flex space-x-3">
                {filters.map((filter) => {
                    const isActive = active === filter;
                    return (
                        <button
                            key={filter}
                            onClick={() => setActive(filter)}
                            className={`px-6 py-2.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-300 font-sans flex-shrink-0 border ${isActive
                                ? 'bg-premium-gold text-black shadow-[0_0_15px_rgba(var(--premium-gold),0.4)] border-transparent'
                                : 'bg-[#181818] text-white/40 hover:bg-[#202020] hover:text-white'
                                }`}
                            style={{ borderColor: isActive ? 'transparent' : 'var(--border-color)' }}
                        >
                            {filter}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
