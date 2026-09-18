'use client';

import React, { useState } from 'react';
import { CreatorBanner } from '@/components/ui/CreatorBanner';
import { StoryModal } from '@/components/ui/StoryModal';
import {
  Mic,
  Sparkles,
  Heart,
  Briefcase,
  Plane,
  Coffee,
  Laptop
} from 'lucide-react';

export default function Home() {
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black">
      {/* 1. Banner com nome do criador, LinkedIn e busca por oportunidade */}
      <CreatorBanner onOpenStory={() => setIsStoryModalOpen(true)} />

      {/* 2. Modal com a história real da entrevista em inglês */}
      <StoryModal isOpen={isStoryModalOpen} onClose={() => setIsStoryModalOpen(false)} />

      {/* 3. Header principal */}
      <header className="border-b border-zinc-800/80 backdrop-blur-md bg-[#09090b]/80 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-black font-extrabold text-xl shadow-lg shadow-emerald-500/20">
              F
            </div>
            <span className="text-xl font-bold tracking-tight">
              FalaIngles<span className="text-emerald-400">.ai</span>
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hidden sm:inline">
              Comunitário & Gratuito
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsStoryModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-full transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Por que criei o FalaIngles.ai?
            </button>
            <a
              href="https://www.linkedin.com/in/john-victor-742463115"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black rounded-full transition-all"
            >
              Ver Perfil do John
            </a>
          </div>
        </div>
      </header>

      {/* 4. Hero Section */}
      <main className="max-w-5xl mx-auto px-4 pt-16 pb-20 text-center relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-8">
          <Heart className="w-3.5 h-3.5 fill-current text-emerald-400" />
          <span>Projeto Aberto para Ajudar Profissionais Brasileiros</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
          Pare de apenas estudar inglês.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-200 to-teal-300">
            Comece a falar.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Pratique conversação diária com uma IA que se adapta ao seu nível, corrige sua fala e elimina a vergonha de errar — sem mensalidades ou pegadinhas.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-14">
          <button
            onClick={() => alert("Pronto para iniciar! No próximo passo conectaremos a chamada de voz ao backend .NET 9.")}
            className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-base rounded-full shadow-xl shadow-emerald-500/25 hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Mic className="w-5 h-5 text-black" />
            Começar a Falar Agora
          </button>
          <button
            onClick={() => setIsStoryModalOpen(true)}
            className="w-full sm:w-auto px-6 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-semibold text-base rounded-full transition-all"
          >
            Conhecer a Motivação
          </button>
        </div>

        {/* Cenários Práticos */}
        <div className="text-left mt-16 pt-12 border-t border-zinc-800/80">
          <h3 className="text-xl font-bold text-white mb-2 text-center">Treine para situações da vida real</h3>
          <p className="text-xs text-zinc-400 text-center mb-8">Simulações desenhadas especialmente para entrevistas e trabalho remoto.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Entrevista Técnica', desc: 'Apresentação pessoal, experiência em .NET e projetos.', icon: <Briefcase className="w-5 h-5 text-blue-400" /> },
              { title: 'Daily & Reuniões de TI', desc: 'Explique blockers, tasks e próximos passos do sprint.', icon: <Laptop className="w-5 h-5 text-purple-400" /> },
              { title: 'Imigração & Viagem', desc: 'Responda as perguntas da alfândega com segurança.', icon: <Plane className="w-5 h-5 text-emerald-400" /> },
              { title: 'Café & Restaurante', desc: 'Faça pedidos especiais e tire dúvidas sobre a conta.', icon: <Coffee className="w-5 h-5 text-amber-400" /> },
            ].map((sc, i) => (
              <div key={i} className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-emerald-500/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center mb-3">
                  {sc.icon}
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{sc.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{sc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-8 text-center text-xs text-zinc-500">
        <p>Desenvolvido com dedicação por <strong>John Victor Gomes</strong> para a comunidade de desenvolvedores.</p>
        <p className="mt-1">Construído com Clean Architecture, .NET 9, WebRTC e React.</p>
      </footer>
    </div>
  );
} 
