'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Laptop,
  Plane,
  Coffee,
  Mic,
  MicOff,
  PhoneOff,
  Check,
  Volume2,
  Loader2,
  AlertCircle
} from 'lucide-react';

/* =========================================================
   TIPOS
========================================================= */

type Scenario = {
  id: string;
  title: string;
  englishTitle: string;
  description: string;
  level: string;
  badge: string;
  initialMessage: string;
};

type TranscriptMessage = {
  sender: 'ai' | 'user';
  text: string;
  translationPt?: string;
};

type ConversationResponse = {
  reply: string;
  translationPt?: string;
};

/* =========================================================
   TIPOS DO SPEECH RECOGNITION
========================================================= */

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionResultListLike {
  length: number;
  [index: number]: SpeechRecognitionResultLike;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: SpeechRecognitionResultListLike;
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;

  onstart: (() => void) | null;

  onresult:
    | ((event: SpeechRecognitionEventLike) => void)
    | null;

  onerror:
    | ((event: SpeechRecognitionErrorEventLike) => void)
    | null;

  onend: (() => void) | null;

  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor =
  new () => SpeechRecognitionLike;

/* =========================================================
   CENÁRIOS
========================================================= */

const scenarios: Scenario[] = [
  {
    id: 'interview',
    title: 'Entrevista Técnica',
    englishTitle: 'Job Interview',
    description:
      'Pratique apresentação pessoal, experiência profissional, projetos e perguntas comuns de entrevistas internacionais.',
    level: 'B1 - C1',
    badge: 'Mais praticado',
    initialMessage:
      'Hello and welcome to this interview. Could you please start by introducing yourself and telling me about your professional experience?'
  },

  {
    id: 'tech',
    title: 'Daily & Reuniões de TI',
    englishTitle: 'Daily Standup',
    description:
      'Explique tarefas, blockers, entregas e próximos passos para uma equipe internacional.',
    level: 'B2 - C2',
    badge: 'Carreira Global',
    initialMessage:
      'Good morning! Let’s start our daily. What were you working on yesterday, and do you have any blockers?'
  },

  {
    id: 'travel',
    title: 'Imigração & Viagem',
    englishTitle: 'Airport & Travel',
    description:
      'Treine situações de aeroporto, imigração, hotel e viagens internacionais.',
    level: 'A2 - B2',
    badge: 'Viagem',
    initialMessage:
      'Good afternoon. May I see your passport? What is the purpose of your trip?'
  },

  {
    id: 'casual',
    title: 'Conversação Casual',
    englishTitle: 'Casual Conversation',
    description:
      'Converse sobre rotina, hobbies, trabalho, filmes, fim de semana e situações do cotidiano.',
    level: 'A1 - C1',
    badge: 'Todos os níveis',
    initialMessage:
      'Hey! It’s nice to meet you. How has your day been going so far?'
  }
];

/* =========================================================
   COMPONENTE
========================================================= */

export default function PracticePage() {
  const router = useRouter();

  /* =======================================================
     ESTADOS
  ======================================================= */

  const [selectedScenario, setSelectedScenario] =
    useState<Scenario | null>(null);

  const [isInCall, setIsInCall] =
    useState(false);

  const [isListening, setIsListening] =
    useState(false);

  const [isAiSpeaking, setIsAiSpeaking] =
    useState(false);

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [isMicMuted, setIsMicMuted] =
    useState(false);

  const [currentInputText, setCurrentInputText] =
    useState('');

  const [callDuration, setCallDuration] =
    useState(0);

  const [errorMessage, setErrorMessage] =
    useState('');

  const [transcript, setTranscript] =
    useState<TranscriptMessage[]>([]);

  /* =======================================================
     REFS
  ======================================================= */

  const recognitionRef =
    useRef<SpeechRecognitionLike | null>(null);

  const timerRef =
    useRef<ReturnType<typeof setInterval> | null>(null);

  const selectedScenarioRef =
    useRef<Scenario | null>(null);

  const callActiveRef =
    useRef(false);

  const micMutedRef =
    useRef(false);

  const aiSpeakingRef =
    useRef(false);

  const processingRef =
    useRef(false);

  const transcriptEndRef =
    useRef<HTMLDivElement | null>(null);

  /* =======================================================
     URL DO BACKEND
  ======================================================= */

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    'https://falainglesai.onrender.com';

  /* =======================================================
     MANTÉM CENÁRIO NO REF
  ======================================================= */

  useEffect(() => {
    selectedScenarioRef.current =
      selectedScenario;
  }, [selectedScenario]);

  /* =======================================================
     LÊ ?scenario=interview
  ======================================================= */

  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const scenarioId =
      params.get('scenario');

    if (!scenarioId) {
      return;
    }

    const scenario =
      scenarios.find(
        item =>
          item.id === scenarioId
      );

    if (scenario) {
      setSelectedScenario(
        scenario
      );

      selectedScenarioRef.current =
        scenario;
    }
  }, []);

  /* =======================================================
     SCROLL AUTOMÁTICO DA CONVERSA
  ======================================================= */

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [
    transcript,
    currentInputText,
    isProcessing
  ]);

  /* =======================================================
     FORMATAR CRONÔMETRO
  ======================================================= */

  const formatTimer = (
    seconds: number
  ) => {
    const minutes =
      Math.floor(seconds / 60);

    const secs =
      seconds % 60;

    return `${minutes
      .toString()
      .padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  /* =======================================================
     COMEÇAR A OUVIR
  ======================================================= */

  const startListening = () => {
    if (
      !callActiveRef.current ||
      micMutedRef.current ||
      aiSpeakingRef.current ||
      processingRef.current
    ) {
      return;
    }

    if (
      !recognitionRef.current
    ) {
      return;
    }

    try {
      recognitionRef.current.start();
    } catch {
      /*
        O navegador pode lançar erro
        se já estiver ouvindo.
      */
    }
  };

  /* =======================================================
     SOPHIA FALA
  ======================================================= */

  const speakAiText = (
    text: string
  ) => {
    if (
      !(
        'speechSynthesis' in
        window
      )
    ) {
      processingRef.current =
        false;

      aiSpeakingRef.current =
        false;

      setIsProcessing(false);

      startListening();

      return;
    }

    /*
      Para o reconhecimento enquanto
      Sophia estiver falando.
    */

    try {
      recognitionRef.current?.stop();
    } catch {
      // Ignora
    }

    window.speechSynthesis.cancel();

    processingRef.current =
      true;

    aiSpeakingRef.current =
      true;

    setIsAiSpeaking(true);

    const utterance =
      new SpeechSynthesisUtterance(
        text
      );

    utterance.lang =
      'en-US';

    utterance.rate =
      0.92;

    utterance.pitch =
      1.05;

    /*
      Procura uma voz americana
      instalada no navegador.
    */

    const voices =
      window.speechSynthesis.getVoices();

    const englishVoice =
      voices.find(
        voice =>
          voice.lang.includes(
            'en-US'
          )
      );

    if (englishVoice) {
      utterance.voice =
        englishVoice;
    }

    utterance.onstart =
      () => {
        setIsAiSpeaking(
          true
        );

        aiSpeakingRef.current =
          true;
      };

    utterance.onend =
      () => {
        setIsAiSpeaking(
          false
        );

        setIsProcessing(
          false
        );

        aiSpeakingRef.current =
          false;

        processingRef.current =
          false;

        /*
          Depois que Sophia termina,
          o usuário pode falar.
        */

        setTimeout(() => {
          startListening();
        }, 350);
      };

    utterance.onerror =
      () => {
        setIsAiSpeaking(
          false
        );

        setIsProcessing(
          false
        );

        aiSpeakingRef.current =
          false;

        processingRef.current =
          false;

        setTimeout(() => {
          startListening();
        }, 350);
      };

    window.speechSynthesis.speak(
      utterance
    );
  };

  /* =======================================================
     ENVIA A FALA DO USUÁRIO PARA O .NET
  ======================================================= */

  const handleUserUtterance =
    async (
      text: string
    ) => {
      const cleanText =
        text.trim();

      if (!cleanText) {
        return;
      }

      const scenario =
        selectedScenarioRef.current;

      if (!scenario) {
        return;
      }

      /*
        Impede o microfone de continuar
        ouvindo enquanto esperamos a API.
      */

      processingRef.current =
        true;

      setIsProcessing(true);

      setIsListening(false);

      setCurrentInputText('');

      setErrorMessage('');

      /*
        Coloca a mensagem do usuário
        na tela.
      */

      setTranscript(
        prev => [
          ...prev,
          {
            sender: 'user',
            text: cleanText
          }
        ]
      );

      try {
        /*
          =========================================
          CHAMA O BACKEND .NET
          =========================================
        */

        const response =
          await fetch(
            `${apiUrl}/api/conversation/message`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json'
              },

              body:
                JSON.stringify(
                  {
                    message:
                      cleanText,

                    scenarioId:
                      scenario.id
                  }
                )
            }
          );

        if (!response.ok) {
          throw new Error(
            `Servidor respondeu com status ${response.status}`
          );
        }

        const data =
          (await response.json()) as ConversationResponse;

        if (
          !data.reply
        ) {
          throw new Error(
            'O backend não retornou uma resposta.'
          );
        }

        /*
          O usuário pode encerrar a chamada
          enquanto o backend responde.
        */

        if (
          !callActiveRef.current
        ) {
          return;
        }

        /*
          Adiciona resposta da Sophia.
        */

        setTranscript(
          prev => [
            ...prev,
            {
              sender: 'ai',
              text:
                data.reply,

              translationPt:
                data.translationPt
            }
          ]
        );

        /*
          Sophia fala a resposta recebida
          do backend.
        */

        speakAiText(
          data.reply
        );
      } catch (error) {
        console.error(
          'Erro ao conversar com o backend:',
          error
        );

        processingRef.current =
          false;

        setIsProcessing(
          false
        );

        const message =
          error instanceof Error
            ? error.message
            : 'Erro desconhecido';

        setErrorMessage(
          `Não foi possível obter a resposta da Sophia. ${message}`
        );

        /*
          Mesmo em caso de erro,
          voltamos a ouvir.
        */

        setTimeout(() => {
          startListening();
        }, 500);
      }
    };

  /* =======================================================
     REF DA FUNÇÃO PARA O SPEECH RECOGNITION
  ======================================================= */

  const handleUserUtteranceRef =
    useRef(handleUserUtterance);

  useEffect(() => {
    handleUserUtteranceRef.current =
      handleUserUtterance;
  });

  /* =======================================================
     CONFIGURA SPEECH RECOGNITION
  ======================================================= */

  useEffect(() => {
    const speechWindow =
      window as typeof window & {
        SpeechRecognition?:
          SpeechRecognitionConstructor;

        webkitSpeechRecognition?:
          SpeechRecognitionConstructor;
      };

    const SpeechRecognition =
      speechWindow.SpeechRecognition ||
      speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn(
        'Speech Recognition não é suportado neste navegador.'
      );

      return;
    }

    const recognition =
      new SpeechRecognition();

    /*
      Uma fala por vez.

      Sophia fala →
      usuário fala →
      backend responde →
      Sophia fala.
    */

    recognition.continuous =
      false;

    recognition.interimResults =
      true;

    recognition.lang =
      'en-US';

    recognition.onstart =
      () => {
        setIsListening(
          true
        );

        setErrorMessage('');
      };

    recognition.onresult =
      event => {
        let interimText =
          '';

        let finalText =
          '';

        for (
          let i =
            event.resultIndex;

          i <
          event.results.length;

          i++
        ) {
          const result =
            event.results[i];

          const detectedText =
            result[0].transcript;

          if (
            result.isFinal
          ) {
            finalText +=
              detectedText;
          } else {
            interimText +=
              detectedText;
          }
        }

        /*
          Texto enquanto usuário
          ainda está falando.
        */

        setCurrentInputText(
          interimText
        );

        /*
          Frase finalizada.
        */

        if (
          finalText.trim()
        ) {
          setCurrentInputText(
            ''
          );

          setIsListening(
            false
          );

          processingRef.current =
            true;

          try {
            recognition.stop();
          } catch {
            // Ignora
          }

          handleUserUtteranceRef.current(
            finalText.trim()
          );
        }
      };

    recognition.onerror =
      event => {
        setIsListening(
          false
        );

        console.warn(
          'Speech Recognition:',
          event.error
        );

        /*
          Silêncio não é um erro grave.
        */

        if (
          event.error ===
          'no-speech'
        ) {
          return;
        }

        if (
          event.error ===
          'aborted'
        ) {
          return;
        }

        if (
          event.error ===
          'not-allowed' ||
          event.error ===
          'service-not-allowed'
        ) {
          micMutedRef.current =
            true;

          setIsMicMuted(
            true
          );

          setErrorMessage(
            'O navegador bloqueou o acesso ao microfone. Permita o microfone para continuar.'
          );
        }
      };

    recognition.onend =
      () => {
        setIsListening(
          false
        );

        /*
          Se ainda estamos na chamada,
          tentamos voltar a ouvir.

          startListening() já verifica
          se Sophia está falando ou
          se estamos esperando a API.
        */

        setTimeout(() => {
          startListening();
        }, 350);
      };

    recognitionRef.current =
      recognition;

    /*
      CLEANUP
    */

    return () => {
      callActiveRef.current =
        false;

      try {
        recognition.stop();
      } catch {
        // Ignora
      }

      if (
        'speechSynthesis' in
        window
      ) {
        window.speechSynthesis.cancel();
      }

      if (
        timerRef.current
      ) {
        clearInterval(
          timerRef.current
        );
      }
    };
  }, []);

  /* =======================================================
     INICIAR A CONVERSA
  ======================================================= */

  const handleStartConversation =
    async () => {
      if (!selectedScenario) {
        return;
      }

      setErrorMessage('');

      /*
        Verifica se existe suporte
        ao microfone.
      */

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        setErrorMessage(
          'Seu navegador não oferece suporte ao microfone.'
        );

        return;
      }

      try {
        /*
          Faz o Chrome pedir permissão
          para o microfone.
        */

        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              audio: true
            }
          );

        /*
          Fecha esse stream inicial.

          Depois quem usa o microfone
          é o SpeechRecognition.
        */

        stream
          .getTracks()
          .forEach(
            track =>
              track.stop()
          );

        selectedScenarioRef.current =
          selectedScenario;

        callActiveRef.current =
          true;

        micMutedRef.current =
          false;

        processingRef.current =
          true;

        aiSpeakingRef.current =
          false;

        setIsMicMuted(
          false
        );

        setIsListening(
          false
        );

        setIsProcessing(
          true
        );

        setIsAiSpeaking(
          false
        );

        setCallDuration(
          0
        );

        setCurrentInputText(
          ''
        );

        /*
          Primeira mensagem da Sophia.
        */

        setTranscript([
          {
            sender: 'ai',
            text:
              selectedScenario.initialMessage
          }
        ]);

        /*
          Abre a tela da chamada.
        */

        setIsInCall(
          true
        );

        /*
          Cronômetro.
        */

        if (
          timerRef.current
        ) {
          clearInterval(
            timerRef.current
          );
        }

        timerRef.current =
          setInterval(
            () => {
              setCallDuration(
                prev =>
                  prev + 1
              );
            },
            1000
          );

        /*
          Sophia começa falando.
        */

        setTimeout(
          () => {
            speakAiText(
              selectedScenario.initialMessage
            );
          },
          600
        );
      } catch (error) {
        console.error(
          'Erro ao acessar microfone:',
          error
        );

        setErrorMessage(
          'Precisamos de acesso ao microfone para iniciar a conversa.'
        );
      }
    };

  /* =======================================================
     ENCERRAR CHAMADA
  ======================================================= */

  const handleEndCall = () => {
    callActiveRef.current =
      false;

    processingRef.current =
      false;

    aiSpeakingRef.current =
      false;

    micMutedRef.current =
      false;

    if (
      timerRef.current
    ) {
      clearInterval(
        timerRef.current
      );

      timerRef.current =
        null;
    }

    try {
      recognitionRef.current?.stop();
    } catch {
      // Ignora
    }

    if (
      'speechSynthesis' in
      window
    ) {
      window.speechSynthesis.cancel();
    }

    setIsListening(
      false
    );

    setIsAiSpeaking(
      false
    );

    setIsProcessing(
      false
    );

    setIsMicMuted(
      false
    );

    setCurrentInputText(
      ''
    );

    setErrorMessage(
      ''
    );

    setIsInCall(
      false
    );
  };

  /* =======================================================
     ATIVAR / DESATIVAR MICROFONE
  ======================================================= */

  const toggleMic = () => {
    const newMutedState =
      !isMicMuted;

    setIsMicMuted(
      newMutedState
    );

    micMutedRef.current =
      newMutedState;

    if (newMutedState) {
      try {
        recognitionRef.current?.stop();
      } catch {
        // Ignora
      }

      setIsListening(
        false
      );
    } else {
      startListening();
    }
  };

  /* =========================================================
     TELA DA CONVERSA
  ========================================================= */

  if (
    isInCall &&
    selectedScenario
  ) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-100">

        {/* HEADER */}

        <header className="h-16 border-b border-zinc-800 bg-[#09090b]/90 backdrop-blur-md flex items-center justify-between px-4 sm:px-8">

          <div className="flex items-center gap-2.5">

            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center font-extrabold text-black">
              F
            </div>

            <span className="font-bold text-lg">

              FalaIngles

              <span className="text-emerald-400">
                .ai
              </span>

            </span>

          </div>

          <div className="flex items-center gap-3">

            {/* CRONÔMETRO */}

            <div className="px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold">

              <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2" />

              {formatTimer(
                callDuration
              )}

            </div>

            {/* ENCERRAR */}

            <button
              onClick={
                handleEndCall
              }
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition"
            >
              <PhoneOff className="w-4 h-4" />

              <span className="hidden sm:inline">
                Encerrar
              </span>

            </button>

          </div>

        </header>

        {/* CONTEÚDO */}

        <main className="max-w-4xl mx-auto px-4 py-8 sm:py-10">

          {/* SOPHIA */}

          <div className="text-center mb-8">

            <div
              className={`
                w-28
                h-28
                mx-auto
                rounded-full
                border
                flex
                items-center
                justify-center
                text-5xl
                mb-5
                transition-all
                duration-300

                ${
                  isAiSpeaking
                    ? 'bg-emerald-500/20 border-emerald-400 shadow-2xl shadow-emerald-500/20 scale-105'
                    : 'bg-zinc-900 border-zinc-700'
                }
              `}
            >
              👩🏼‍💼
            </div>

            <h1 className="text-2xl font-bold text-white">
              Sophia
            </h1>

            <p className="text-sm text-zinc-400 mt-1">
              Tutora de inglês • Estados Unidos
            </p>

            {/* STATUS */}

            <div className="mt-4 h-7 flex items-center justify-center">

              {isAiSpeaking && (
                <span className="inline-flex items-center gap-2 text-emerald-400 text-sm font-medium">

                  <Volume2 className="w-4 h-4 animate-pulse" />

                  Sophia está falando...

                </span>
              )}

              {!isAiSpeaking &&
                isProcessing && (
                  <span className="inline-flex items-center gap-2 text-emerald-400 text-sm font-medium">

                    <Loader2 className="w-4 h-4 animate-spin" />

                    Sophia está pensando...

                  </span>
                )}

              {!isAiSpeaking &&
                !isProcessing &&
                isListening &&
                !isMicMuted && (
                  <span className="inline-flex items-center gap-2 text-emerald-400 text-sm font-medium">

                    <span className="relative flex h-2 w-2">

                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />

                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />

                    </span>

                    Ouvindo você...

                  </span>
                )}

              {!isAiSpeaking &&
                !isProcessing &&
                !isListening &&
                !isMicMuted && (
                  <span className="text-zinc-500 text-sm">
                    Preparando microfone...
                  </span>
                )}

              {isMicMuted && (
                <span className="inline-flex items-center gap-2 text-red-400 text-sm">

                  <MicOff className="w-4 h-4" />

                  Microfone desativado

                </span>
              )}

            </div>

          </div>

          {/* ERRO */}

          {errorMessage && (
            <div className="mb-5 bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-3 text-sm text-red-300 flex items-start gap-3">

              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />

              <div>
                {errorMessage}
              </div>

            </div>
          )}

          {/* CONVERSA */}

          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl overflow-hidden">

            {/* CABEÇALHO */}

            <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-zinc-800">

              <div>

                <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                  {selectedScenario.title}
                </p>

                <p className="text-xs text-zinc-500 mt-1">
                  Converse naturalmente em inglês.
                </p>

              </div>

              <div className="hidden sm:block text-xs px-3 py-1 rounded-full bg-zinc-800 text-zinc-400">
                {selectedScenario.level}
              </div>

            </div>

            {/* MENSAGENS */}

            <div className="p-5 sm:p-7 min-h-[320px] max-h-[430px] overflow-y-auto">

              <div className="space-y-4">

                {transcript.map(
                  (
                    message,
                    index
                  ) => (
                    <div
                      key={index}
                      className={`
                        flex

                        ${
                          message.sender ===
                          'user'
                            ? 'justify-end'
                            : 'justify-start'
                        }
                      `}
                    >

                      <div
                        className={`
                          max-w-[85%]
                          sm:max-w-[75%]
                          rounded-2xl
                          px-4
                          py-3

                          ${
                            message.sender ===
                            'user'
                              ? 'bg-emerald-500 text-black rounded-br-md'
                              : 'bg-zinc-800 text-zinc-100 rounded-bl-md'
                          }
                        `}
                      >

                        <span
                          className={`
                            block
                            text-[10px]
                            font-bold
                            mb-1
                            uppercase
                            tracking-wider

                            ${
                              message.sender ===
                              'user'
                                ? 'text-black/60'
                                : 'text-emerald-400'
                            }
                          `}
                        >

                          {message.sender ===
                          'user'
                            ? 'Você'
                            : 'Sophia'}

                        </span>

                        <p className="text-sm sm:text-base leading-relaxed">
                          {message.text}
                        </p>

                        {/* TRADUÇÃO */}

                        {message.sender ===
                          'ai' &&
                          message.translationPt && (
                            <p className="text-xs text-zinc-400 mt-2 pt-2 border-t border-zinc-700/60">
                              🇧🇷{' '}
                              {
                                message.translationPt
                              }
                            </p>
                          )}

                      </div>

                    </div>
                  )
                )}

                {/* TEXTO SENDO ESCUTADO */}

                {currentInputText && (
                  <div className="flex justify-end">

                    <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-br-md px-4 py-3 border border-emerald-500/30 bg-emerald-500/5">

                      <span className="block text-[10px] text-emerald-400 font-bold mb-1 uppercase tracking-wider">
                        Ouvindo...
                      </span>

                      <p className="text-sm text-zinc-400 italic">
                        {
                          currentInputText
                        }
                      </p>

                    </div>

                  </div>
                )}

                {/* ESPERANDO BACKEND */}

                {isProcessing &&
                  !isAiSpeaking &&
                  transcript.length >
                    1 && (
                    <div className="flex justify-start">

                      <div className="rounded-2xl rounded-bl-md px-4 py-3 bg-zinc-800 text-zinc-400">

                        <div className="flex items-center gap-2 text-sm">

                          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />

                          Sophia está pensando...

                        </div>

                      </div>

                    </div>
                  )}

                <div ref={transcriptEndRef} />

              </div>

            </div>

          </div>

          {/* CONTROLES */}

          <div className="flex justify-center items-center gap-5 mt-8">

            {/* MICROFONE */}

            <button
              onClick={toggleMic}
              disabled={
                isAiSpeaking ||
                isProcessing
              }
              title={
                isMicMuted
                  ? 'Ativar microfone'
                  : 'Desativar microfone'
              }
              className={`
                w-14
                h-14
                rounded-full
                flex
                items-center
                justify-center
                border
                transition-all

                ${
                  isMicMuted
                    ? 'bg-red-500/10 border-red-500/40 text-red-400'
                    : 'bg-zinc-900 border-zinc-700 text-white hover:border-emerald-500 hover:bg-zinc-800'
                }

                disabled:opacity-40
                disabled:cursor-not-allowed
              `}
            >

              {isMicMuted ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}

            </button>

            {/* ENCERRAR */}

            <button
              onClick={
                handleEndCall
              }
              title="Encerrar conversa"
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-xl shadow-red-600/20 transition-all hover:scale-105 active:scale-95"
            >
              <PhoneOff className="w-6 h-6" />
            </button>

          </div>

          <p className="text-center text-xs text-zinc-600 mt-5">
            Fale normalmente. Quando você terminar, sua resposta será enviada ao servidor.
          </p>

        </main>

      </div>
    );
  }

  /* =========================================================
     TELA DE SELEÇÃO DE CENÁRIO
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">

      {/* HEADER */}

      <header className="border-b border-zinc-800/80 bg-[#09090b]/90 backdrop-blur-md sticky top-0 z-40">

        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          <button
            onClick={() =>
              router.push('/')
            }
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />

            Voltar
          </button>

          <div className="flex items-center gap-2.5">

            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-black font-extrabold">
              F
            </div>

            <span className="font-bold text-lg">

              FalaIngles

              <span className="text-emerald-400">
                .ai
              </span>

            </span>

          </div>

          <div className="w-16" />

        </div>

      </header>

      {/* CONTEÚDO */}

      <main className="max-w-5xl mx-auto px-4 py-14">

        {/* TÍTULO */}

        <div className="text-center mb-12">

          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs font-bold text-emerald-400 mb-5">

            <Mic className="w-3.5 h-3.5" />

            PRÁTICA DE CONVERSAÇÃO

          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            O que você quer praticar?
          </h1>

          <p className="text-zinc-400 max-w-xl mx-auto">
            Escolha uma situação real e pratique inglês conversando por voz.
          </p>

        </div>

        {/* CENÁRIOS */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {scenarios.map(
            scenario => {
              const selected =
                selectedScenario
                  ?.id ===
                scenario.id;

              return (
                <button
                  key={
                    scenario.id
                  }
                  onClick={() => {
                    setSelectedScenario(
                      scenario
                    );

                    selectedScenarioRef.current =
                      scenario;

                    setErrorMessage(
                      ''
                    );
                  }}
                  className={`
                    relative
                    text-left
                    p-6
                    rounded-3xl
                    border
                    transition-all
                    duration-200

                    ${
                      selected
                        ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/5'
                        : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700'
                    }
                  `}
                >

                  {/* CHECK */}

                  {selected && (
                    <div className="absolute top-5 right-5 w-7 h-7 bg-emerald-500 text-black rounded-full flex items-center justify-center">

                      <Check className="w-4 h-4" />

                    </div>
                  )}

                  <div className="flex items-start gap-4">

                    {/* ÍCONE */}

                    <div
                      className={`
                        w-12
                        h-12
                        rounded-2xl
                        flex
                        items-center
                        justify-center
                        shrink-0

                        ${
                          selected
                            ? 'bg-emerald-500 text-black'
                            : 'bg-zinc-800 text-zinc-300'
                        }
                      `}
                    >

                      {scenario.id ===
                        'interview' && (
                        <Briefcase className="w-5 h-5" />
                      )}

                      {scenario.id ===
                        'tech' && (
                        <Laptop className="w-5 h-5" />
                      )}

                      {scenario.id ===
                        'travel' && (
                        <Plane className="w-5 h-5" />
                      )}

                      {scenario.id ===
                        'casual' && (
                        <Coffee className="w-5 h-5" />
                      )}

                    </div>

                    <div className="pr-6">

                      <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">
                        {
                          scenario.badge
                        }
                      </span>

                      <h2 className="text-lg font-bold text-white mt-1">
                        {
                          scenario.title
                        }
                      </h2>

                      <p className="text-xs text-zinc-500 mb-3">
                        {
                          scenario.englishTitle
                        }
                      </p>

                      <p className="text-sm text-zinc-400 leading-relaxed">
                        {
                          scenario.description
                        }
                      </p>

                      <div className="mt-4">

                        <span className="text-xs px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-zinc-300">

                          Nível{' '}
                          {
                            scenario.level
                          }

                        </span>

                      </div>

                    </div>

                  </div>

                </button>
              );
            }
          )}

        </div>

        {/* ERRO */}

        {errorMessage && (
          <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-3 text-sm text-red-300 flex items-start gap-3">

            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />

            <span>
              {errorMessage}
            </span>

          </div>
        )}

        {/* CENÁRIO SELECIONADO */}

        {selectedScenario && (
          <div className="mt-8 bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

              <div>

                <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400">
                  Cenário selecionado
                </span>

                <h3 className="text-xl font-bold text-white mt-1">
                  {
                    selectedScenario.title
                  }
                </h3>

                <p className="text-sm text-zinc-400 mt-2 max-w-xl">
                  Sophia começará a conversa em inglês. Responda naturalmente usando o microfone.
                </p>

              </div>

              <button
                onClick={
                  handleStartConversation
                }
                className="
                  bg-emerald-500
                  hover:bg-emerald-400
                  text-black
                  font-bold
                  px-6
                  py-4
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  gap-2
                  shrink-0
                  transition-all
                  hover:scale-105
                  active:scale-95
                  shadow-lg
                  shadow-emerald-500/20
                "
              >

                <Mic className="w-5 h-5" />

                Iniciar conversa

                <ArrowRight className="w-4 h-4" />

              </button>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}