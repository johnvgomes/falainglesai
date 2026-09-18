'use client';
import React from 'react';
import { Sparkles } from 'lucide-react';

interface CreatorBannerProps {
  onOpenStory: () => void;
}

export function CreatorBanner({ onOpenStory }: CreatorBannerProps) {
  return (
    <div className="w-full bg-gradient-to-r from-emerald-950 via-zinc-900 to-emerald-950 border-b border-emerald-500/30 px-4 py-2 text-xs">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-zinc-300">
            Desenvolvido por <strong className="text-white">John Victor Gomes</strong> • Full Stack (.NET, C#, React)
          </span>
          <span className="hidden md:inline px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-[10px] border border-emerald-500/30">
            🚀 Em busca de oportunidade
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenStory}
            className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Por que criei este projeto?
          </button>
          <a
            href="https://www.linkedin.com/in/john-victor-742463115"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-md font-medium flex items-center gap-1.5 transition-all"
          >
            <svg className="w-3.5 h-3.5 fill-[#0A66C2]" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64c-.88 0-1.6.72-1.6 1.6s.72 1.6 1.6 1.6 1.6-.72 1.6-1.6-.72-1.6-1.6-1.6Z"/>
            </svg>
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}