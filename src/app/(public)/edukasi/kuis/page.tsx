"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit, Clock, Check, X, AlertCircle, Sparkles,
  ArrowRight, Award, Trophy, ArrowLeft
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MOCK_QUIZ } from "@/lib/data/marketplace-data";
import { cn } from "@/lib/utils";

export default function QuizInterfacePage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MOCK_QUIZ.time_limit);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = MOCK_QUIZ.questions[currentIdx];

  // Timer effect
  useEffect(() => {
    if (quizFinished) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setQuizFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quizFinished]);

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
  };

  const handleAnswerSubmit = () => {
    if (selectedOpt === null || isAnswered) return;
    setIsAnswered(true);

    if (selectedOpt === currentQuestion.correct_answer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedOpt(null);

    if (currentIdx < MOCK_QUIZ.questions.length - 1) {
      setCurrentIdx((idx) => idx + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
  };

  const finalScorePercent = Math.round((score / MOCK_QUIZ.questions.length) * 100);
  const isPassed = finalScorePercent >= MOCK_QUIZ.pass_score;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-24 md:pt-28 pb-12">
        <div className="container-base max-w-xl">
          <div className="mb-6 flex justify-between items-center">
            <Link href="/edukasi" className="flex items-center gap-1 text-sm text-charcoal-500 hover:text-forest-600 font-medium">
              <ArrowLeft className="w-4 h-4" /> Keluar Kuis
            </Link>
            {!quizFinished && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border rounded-xl text-xs font-semibold text-charcoal-700">
                <Clock className="w-4 h-4 text-forest-600" />
                {formatTime(timeLeft)}
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!quizFinished ? (
              <motion.div
                key={currentIdx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white rounded-3xl border border-border/60 p-6 sm:p-8 space-y-6"
              >
                {/* Question Info Header */}
                <div className="flex justify-between items-center text-xs text-charcoal-400 border-b border-border/40 pb-3">
                  <span className="font-semibold text-forest-700">Pertanyaan {currentIdx + 1} dari {MOCK_QUIZ.questions.length}</span>
                  <span>Point: {score * 20} LP</span>
                </div>

                {/* Question title */}
                <h2 className="text-base sm:text-lg font-bold text-charcoal-800 leading-snug">
                  {currentQuestion.question}
                </h2>

                {/* Options List */}
                <div className="space-y-2.5">
                  {currentQuestion.options.map((opt, idx) => {
                    const isSelected = selectedOpt === idx;
                    const isCorrect = idx === currentQuestion.correct_answer;
                    const isWrong = isSelected && !isCorrect;

                    return (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => handleSelect(idx)}
                        className={cn(
                          "w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between",
                          isAnswered
                            ? isCorrect
                              ? "border-moss-500 bg-moss-50 text-moss-700"
                              : isWrong
                              ? "border-red-500 bg-red-50 text-red-600"
                              : "border-border text-charcoal-400"
                            : isSelected
                            ? "border-forest-600 bg-forest-50 text-forest-700"
                            : "border-border hover:border-charcoal-300 text-charcoal-700"
                        )}
                      >
                        <span>{opt}</span>
                        {isAnswered && isCorrect && <Check className="w-4 h-4 text-moss-500" />}
                        {isAnswered && isWrong && <X className="w-4 h-4 text-red-500" />}
                      </button>
                    );
                  })}
                </div>

                {/* Answer Explanation */}
                {isAnswered && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-mist rounded-xl text-xs text-charcoal-600 leading-normal flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-forest-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-charcoal-700">Pembahasan:</p>
                      <p className="mt-0.5">{currentQuestion.explanation}</p>
                    </div>
                  </motion.div>
                )}

                {/* Action button */}
                <div className="flex justify-end pt-2">
                  {!isAnswered ? (
                    <button
                      onClick={handleAnswerSubmit}
                      disabled={selectedOpt === null}
                      className="btn-primary"
                    >
                      Kirim Jawaban
                    </button>
                  ) : (
                    <button onClick={handleNext} className="btn-primary gap-1">
                      {currentIdx === MOCK_QUIZ.questions.length - 1 ? "Selesaikan" : "Lanjut"} <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              /* Success / Result screen */
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl border border-border/60 p-8 text-center space-y-6"
              >
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-forest-50 border border-forest-200 flex items-center justify-center text-forest-600">
                    {isPassed ? <Trophy className="w-10 h-10 text-amber-500" /> : <BrainCircuit className="w-10 h-10" />}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-charcoal-800">{isPassed ? "Selamat, Kuis Lulus! 🎉" : "Kuis Belum Lulus"}</h2>
                  <p className="text-xs text-charcoal-500 mt-1.5 leading-relaxed">
                    Skor akhir Anda: <strong>{finalScorePercent}%</strong> (Diperlukan minimal {MOCK_QUIZ.pass_score}%)
                  </p>
                </div>

                <div className="p-4 bg-forest-50 border border-forest-100 rounded-2xl flex items-start gap-2.5 text-left text-xs text-forest-700 leading-normal max-w-sm mx-auto">
                  <Sparkles className="w-4 h-4 text-forest-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Lencana Points Diperoleh:</p>
                    <p className="text-charcoal-600 mt-0.5">+{score * 20} Learning Points (LP) ditambahkan ke profil belajar Anda.</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => { setCurrentIdx(0); setScore(0); setTimeLeft(MOCK_QUIZ.time_limit); setQuizFinished(false); }} className="btn-secondary flex-1 py-3 text-xs justify-center">
                    Coba Lagi
                  </button>
                  <Link href="/edukasi" className="btn-primary flex-1 py-3 text-xs justify-center">
                    Kembali ke Hub
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}
