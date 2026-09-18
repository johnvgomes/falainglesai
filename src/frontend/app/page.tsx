'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { CreatorBanner } from '@/components/ui/CreatorBanner';
import { StoryModal } from '@/components/ui/StoryModal';

import {
  Mic,
  Sparkles,
  Heart,
  Briefcase,
  Plane,
  Coffee,
  Laptop,
  ArrowRight
} from 'lucide-react';

const scenarios = [
  {
    id: 'interview',
    title: 'Entrevista Técnica',
    desc: 'Apresentação pessoal, experiência em .NET e projetos.',
    icon: <Briefcase className="w-5 h-5 text-blue-400" />
  },
  {
    id: 'tech',
    title: 'Daily & Reuniões de TI',
    desc: 'Explique blockers, tasks e próximos passos do sprint.',
    icon: <Laptop className="w-5 h-5 text-purple-400" />
  },
  {
    id: 'travel',
    title: 'Imigração & Viagem',
    desc: 'Responda perguntas da alfândega e pratique situações de viagem.',
    icon: <Plane className="w-5 h-5 text-emerald-400" />
  },
  {
    id: 'casual',
    title: 'Café & Conversação',
    desc: 'Pratique situações do cotidiano, pedidos e conversas casuais.',
    icon: <Coffee className="w-5 h-5 text-amber-400" />
  }
];

export default function Home() {
  const router = useRouter();

  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  /**
   * Botão principal.
   *
   * Não fazemos mais /api/health aqui.
   * A conexão com o backend já foi validada.
   *
   * Agora o botão leva o usuário para a experiência real.
   */
  const handleStartSpeaking = () => {
    router.push('/practice');
  };

  /**
   * Permite entrar na prática já selecionando
   * um cenário específico.
   *
   * Exemplo:
   * /practice?scenario=interview
   */
  const handleScenarioClick = (scenarioId: string) => {
    router.push(`/practice?scenario=${scenarioId}`);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black">

      {/* ===================================================== */}
      {/* BANNER DO CRIADOR                                     */}
      {/* ===================================================== */}

      <CreatorBanner
        onOpenStory={() => setIsStoryModalOpen(true)}
      />

      {/* ===================================================== */}
      {/* MODAL COM A HISTÓRIA DO PROJETO                       */}
      {/* ===================================================== */}

      <StoryModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
      />

      {/* ===================================================== */}
      {/* HEADER                                                */}
      {/* ===================================================== */}

      <header className="border-b border-zinc-800/80 backdrop-blur-md bg-[#09090b]/80 sticky top-0 z-40">

        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2.5">

            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-black font-extrabold text-xl shadow-lg shadow-emerald-500/20">
              F
            </div>

            <span className="text-xl font-bold tracking-tight">
              FalaIngles
              <span className="text-emerald-400">
                .ai
              </span>
            </span>

            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hidden sm:inline">
              Comunitário & Gratuito
            </span>

          </div>

          {/* Ações do header */}
          <div className="flex items-center gap-3">

            <button
              onClick={() => setIsStoryModalOpen(true)}
              className="
                hidden sm:flex
                px-4 py-2
                text-xs font-semibold
                bg-zinc-800
                hover:bg-zinc-700
                text-zinc-200
                rounded-full
                transition-all
                items-center
                gap-1.5
              "
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />

              Por que criei o FalaIngles.ai?
            </button>

            <a
              href="https://www.linkedin.com/in/john-victor-742463115"
              target="_blank"
              rel="noopener noreferrer"
              className="
                px-4 py-2
                text-xs font-bold
                bg-emerald-500
                hover:bg-emerald-400
                text-black
                rounded-full
                transition-all
              "
            >
              Ver Perfil do John
            </a>

          </div>

        </div>

      </header>

      {/* ===================================================== */}
      {/* HERO                                                  */}
      {/* ===================================================== */}

      <main className="max-w-5xl mx-auto px-4 pt-16 pb-20 text-center relative">

        {/* Luz de fundo */}
        <div
          className="
            absolute
            top-1/4
            left-1/2
            -translate-x-1/2
            w-[500px]
            h-[300px]
            bg-emerald-500/10
            rounded-full
            blur-[120px]
            pointer-events-none
            -z-10
          "
        />

        {/* Badge */}
        <div
          className="
            inline-flex
            items-center
            gap-2
            px-3.5
            py-1.5
            rounded-full
            bg-emerald-500/10
            border
            border-emerald-500/30
            text-emerald-400
            text-xs
            font-semibold
            mb-8
          "
        >

          <Heart className="w-3.5 h-3.5 fill-current text-emerald-400" />

          <span>
            Projeto Aberto para Ajudar Profissionais Brasileiros
          </span>

        </div>

        {/* Título */}
        <h1
          className="
            text-4xl
            sm:text-6xl
            md:text-7xl
            font-extrabold
            tracking-tight
            text-white
            leading-[1.1]
            mb-6
          "
        >

          Pare de apenas estudar inglês.{' '}

          <span
            className="
              text-transparent
              bg-clip-text
              bg-gradient-to-r
              from-emerald-400
              via-emerald-200
              to-teal-300
            "
          >
            Comece a falar.
          </span>

        </h1>

        {/* Texto */}
        <p
          className="
            text-base
            sm:text-xl
            text-zinc-400
            max-w-2xl
            mx-auto
            mb-10
            leading-relaxed
          "
        >

          Pratique conversação diária com uma IA que se adapta ao seu nível,
          corrige sua fala e elimina a vergonha de errar — sem mensalidades
          ou pegadinhas.

        </p>

        {/* ================================================= */}
        {/* CTA PRINCIPAL                                     */}
        {/* ================================================= */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            items-center
            justify-center
            gap-4
            max-w-lg
            mx-auto
            mb-14
          "
        >

          <button
            onClick={handleStartSpeaking}
            className="
              w-full
              sm:w-auto
              px-8
              py-4
              bg-emerald-500
              hover:bg-emerald-400
              text-black
              font-bold
              text-base
              rounded-full
              shadow-xl
              shadow-emerald-500/25
              hover:scale-105
              active:scale-95
              transition-all
              flex
              items-center
              justify-center
              gap-2
            "
          >

            <Mic className="w-5 h-5 text-black" />

            Começar a Falar Agora

            <ArrowRight className="w-4 h-4" />

          </button>

          <button
            onClick={() => setIsStoryModalOpen(true)}
            className="
              w-full
              sm:w-auto
              px-6
              py-4
              bg-zinc-900
              hover:bg-zinc-800
              border
              border-zinc-800
              text-zinc-200
              font-semibold
              text-base
              rounded-full
              transition-all
            "
          >
            Conhecer a Motivação
          </button>

        </div>

        {/* ================================================= */}
        {/* CENÁRIOS                                          */}
        {/* ================================================= */}

        <div
          className="
            text-left
            mt-16
            pt-12
            border-t
            border-zinc-800/80
          "
        >

          <h3 className="text-xl font-bold text-white mb-2 text-center">
            Treine para situações da vida real
          </h3>

          <p className="text-xs sm:text-sm text-zinc-400 text-center mb-8">

            Escolha um cenário e pratique conversas que você realmente
            pode enfrentar no trabalho, em entrevistas ou viajando.

          </p>

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-4
            "
          >

            {scenarios.map((scenario) => (

              <button
                key={scenario.id}
                onClick={() => handleScenarioClick(scenario.id)}
                className="
                  group
                  text-left
                  p-5
                  rounded-2xl
                  bg-zinc-900/60
                  border
                  border-zinc-800
                  hover:border-emerald-500/50
                  hover:bg-zinc-900
                  hover:-translate-y-1
                  transition-all
                "
              >

                <div
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-zinc-800
                    group-hover:bg-zinc-800/80
                    flex
                    items-center
                    justify-center
                    mb-3
                    transition
                  "
                >
                  {scenario.icon}
                </div>

                <h4
                  className="
                    text-sm
                    font-bold
                    text-white
                    mb-1
                    group-hover:text-emerald-300
                    transition-colors
                  "
                >
                  {scenario.title}
                </h4>

                <p
                  className="
                    text-xs
                    text-zinc-400
                    leading-relaxed
                    mb-4
                  "
                >
                  {scenario.desc}
                </p>

                <div
                  className="
                    flex
                    items-center
                    gap-1
                    text-xs
                    font-semibold
                    text-emerald-400
                    opacity-70
                    group-hover:opacity-100
                    transition
                  "
                >

                  Praticar

                  <ArrowRight
                    className="
                      w-3.5
                      h-3.5
                      group-hover:translate-x-1
                      transition-transform
                    "
                  />

                </div>

              </button>

            ))}

          </div>

        </div>

        {/* ================================================= */}
        {/* COMO FUNCIONA                                     */}
        {/* ================================================= */}

        <section
          className="
            mt-24
            pt-16
            border-t
            border-zinc-800/80
          "
        >

          <div className="mb-10">

            <span
              className="
                text-xs
                uppercase
                tracking-[0.2em]
                font-bold
                text-emerald-400
              "
            >
              Simples e direto
            </span>

            <h2
              className="
                text-2xl
                sm:text-3xl
                font-extrabold
                text-white
                mt-3
              "
            >
              Como funciona?
            </h2>

          </div>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-5
              text-left
            "
          >

            {/* Passo 1 */}
            <div
              className="
                bg-zinc-900/50
                border
                border-zinc-800
                rounded-2xl
                p-6
              "
            >

              <div
                className="
                  w-9
                  h-9
                  rounded-full
                  bg-emerald-500
                  text-black
                  flex
                  items-center
                  justify-center
                  font-extrabold
                  mb-4
                "
              >
                1
              </div>

              <h3 className="font-bold text-white mb-2">
                Escolha o cenário
              </h3>

              <p className="text-sm text-zinc-400 leading-relaxed">

                Pratique entrevistas, reuniões de trabalho,
                situações de viagem ou conversas do cotidiano.

              </p>

            </div>

            {/* Passo 2 */}
            <div
              className="
                bg-zinc-900/50
                border
                border-zinc-800
                rounded-2xl
                p-6
              "
            >

              <div
                className="
                  w-9
                  h-9
                  rounded-full
                  bg-emerald-500
                  text-black
                  flex
                  items-center
                  justify-center
                  font-extrabold
                  mb-4
                "
              >
                2
              </div>

              <h3 className="font-bold text-white mb-2">
                Fale pelo microfone
              </h3>

              <p className="text-sm text-zinc-400 leading-relaxed">

                Sua fala será reconhecida em tempo real
                diretamente pelo navegador.

              </p>

            </div>

            {/* Passo 3 */}
            <div
              className="
                bg-zinc-900/50
                border
                border-zinc-800
                rounded-2xl
                p-6
              "
            >

              <div
                className="
                  w-9
                  h-9
                  rounded-full
                  bg-emerald-500
                  text-black
                  flex
                  items-center
                  justify-center
                  font-extrabold
                  mb-4
                "
              >
                3
              </div>

              <h3 className="font-bold text-white mb-2">
                Converse com a IA
              </h3>

              <p className="text-sm text-zinc-400 leading-relaxed">

                A IA responde, continua a conversa
                e futuramente gera um feedback personalizado.

              </p>

            </div>

          </div>

        </section>

      </main>

      {/* ===================================================== */}
      {/* FOOTER                                                */}
      {/* ===================================================== */}

      <footer
        className="
          border-t
          border-zinc-800/80
          py-8
          px-4
          text-center
          text-xs
          text-zinc-500
        "
      >

        <p>

          Desenvolvido com dedicação por{' '}

          <strong className="text-zinc-300">
            John Victor Gomes
          </strong>{' '}

          para a comunidade de desenvolvedores.

        </p>

        <p className="mt-1">
          Construído com Clean Architecture, .NET 10, WebRTC e React.
        </p>

      </footer>

    </div>
  );
}