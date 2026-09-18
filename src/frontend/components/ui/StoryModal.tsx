'use client';
import React from 'react';
import { X, Briefcase, Heart, CheckCircle2 } from 'lucide-react';

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StoryModal({ isOpen, onClose }: StoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-700 max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg bg-zinc-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xl border border-emerald-500/30">
            JV
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">John Victor Gomes</h3>
            <p className="text-xs text-emerald-400 font-semibold">Backend & Full Stack Developer (.NET / C# / React)</p>
          </div>
        </div>

        <div className="space-y-3.5 text-sm text-zinc-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
          <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 flex items-start gap-2">
            <Heart className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>
              <strong>A faísca do projeto:</strong> Durante um processo seletivo em inglês, percebi que dominar a leitura técnica não impedia o nervosismo e o bloqueio na fala oral.
            </span>
          </div>

          <p>
            Muitos desenvolvedores e profissionais brasileiros passam exatamente por isso: temos a competência técnica, mas nos falta a prática diária de fala. Além disso, a maioria não tem R$ 400 a R$ 600 por mês para bancar aulas particulares.
          </p>

          <p>
            Decidi transformar essa dor em engenharia: construí o <strong>SpeakAI</strong> usando Clean Architecture, .NET 9, WebRTC e React para que qualquer pessoa possa treinar 10 minutos por dia sem medo de errar e de forma <strong>100% gratuita</strong>.
          </p>

          <div className="pt-2 border-t border-zinc-800">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Stack & Habilidades Aplicadas:</h4>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {['C# / .NET 9', 'ASP.NET Core', 'Clean Architecture', 'SOLID', 'React / Next.js', 'PostgreSQL', 'Docker', 'WebRTC'].map(tech => (
                <span key={tech} className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-800 flex flex-col sm:flex-row gap-3">
          <a
            href="https://www.linkedin.com/in/john-victor-742463115"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 bg-[#0A66C2] hover:bg-[#004182] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
          >
            {/* SVG do LinkedIn */}
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64c-.88 0-1.6.72-1.6 1.6s.72 1.6 1.6 1.6 1.6-.72 1.6-1.6-.72-1.6-1.6-1.6Z"/>
            </svg>
            Conectar no LinkedIn
          </a>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs rounded-xl transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}