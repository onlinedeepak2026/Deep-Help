import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';
import { INITIAL_QUIZ_QUESTIONS } from '../data/initialQuestions';
import {
  GraduationCap,
  Play,
  Settings2,
  Plus,
  Edit2,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  Award,
  AlertCircle,
  HelpCircle,
  Save,
  Check,
} from 'lucide-react';

const STORAGE_KEY = 'deephelp_quiz_questions';

export const QuizManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'play' | 'manage'>('play');
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load questions from localStorage', e);
    }
    return INITIAL_QUIZ_QUESTIONS;
  });

  // Save questions to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
    } catch (e) {
      console.error('Failed to persist questions to localStorage', e);
    }
  }, [questions]);

  // ===================== QUIZ ENGINE STATE =====================
  const [quizState, setQuizState] = useState<'idle' | 'running' | 'finished'>('idle');
  const [quizCategory, setQuizCategory] = useState<string>('All');
  const [selectedQuestions, setSelectedQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [timerSeconds, setTimerSeconds] = useState<number>(30); // 30s per question
  const [timeLeft, setTimeLeft] = useState<number>(30);

  // Timer interval
  useEffect(() => {
    if (quizState !== 'running') return;

    if (timeLeft <= 0) {
      // Auto-advance or finish
      handleNextQuestion();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [quizState, timeLeft, currentIndex]);

  const startQuiz = () => {
    let pool = [...questions];
    if (quizCategory !== 'All') {
      pool = pool.filter((q) => q.category === quizCategory);
    }
    if (pool.length === 0) return;

    // Shuffle
    const shuffled = pool.sort(() => Math.random() - 0.5);
    setSelectedQuestions(shuffled);
    setCurrentIndex(0);
    setUserAnswers({});
    setTimeLeft(timerSeconds);
    setQuizState('running');
  };

  const handleSelectAnswer = (optionIndex: number) => {
    const currentQ = selectedQuestions[currentIndex];
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex,
    }));
  };

  const handleNextQuestion = () => {
    if (currentIndex < selectedQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(timerSeconds);
    } else {
      setQuizState('finished');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setTimeLeft(timerSeconds);
    }
  };

  // Score calculation
  const scoreStats = React.useMemo(() => {
    if (selectedQuestions.length === 0) return { score: 0, total: 0, percentage: 0 };
    let correct = 0;
    selectedQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correctOption) {
        correct++;
      }
    });
    const total = selectedQuestions.length;
    const percentage = Math.round((correct / total) * 100);
    return { score: correct, total, percentage };
  }, [selectedQuestions, userAnswers]);

  // ===================== CRUD MANAGEMENT STATE =====================
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    question: string;
    category: string;
    options: string[];
    correctOption: number;
    explanation: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
  }>({
    question: '',
    category: 'Concrete Technology',
    options: ['', '', '', ''],
    correctOption: 0,
    explanation: '',
    difficulty: 'Medium',
  });

  const handleOpenAddForm = () => {
    setEditingQuestion(null);
    setFormData({
      question: '',
      category: 'Concrete Technology',
      options: ['', '', '', ''],
      correctOption: 0,
      explanation: '',
      difficulty: 'Medium',
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (q: QuizQuestion) => {
    setEditingQuestion(q);
    setFormData({
      question: q.question,
      category: q.category,
      options: [...q.options],
      correctOption: q.correctOption,
      explanation: q.explanation,
      difficulty: q.difficulty,
    });
    setIsFormOpen(true);
  };

  const handleSaveQuestionForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim() || formData.options.some((opt) => !opt.trim())) {
      alert('Please fill in the question and all 4 options.');
      return;
    }

    if (editingQuestion) {
      // Update
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === editingQuestion.id
            ? {
                ...q,
                ...formData,
              }
            : q
        )
      );
    } else {
      // Create
      const newQ: QuizQuestion = {
        id: 'q-' + Date.now(),
        ...formData,
      };
      setQuestions((prev) => [newQ, ...prev]);
    }

    setIsFormOpen(false);
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    }
  };

  const handleResetQuestions = () => {
    if (confirm('Reset question bank back to the official 10 standard engineering questions?')) {
      setQuestions(INITIAL_QUIZ_QUESTIONS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_QUIZ_QUESTIONS));
    }
  };

  const currentQ = selectedQuestions[currentIndex];
  const uniqueCategories = Array.from(new Set(questions.map((q) => q.category)));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Civil Engineering Quiz & Assessment System
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Test your site engineering knowledge with timed MCQs, detailed explanations, and full question management (CRUD).
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          <button
            id="quiz-tab-play"
            type="button"
            onClick={() => setActiveTab('play')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'play'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Practice Quiz</span>
          </button>
          <button
            id="quiz-tab-manage"
            type="button"
            onClick={() => setActiveTab('manage')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'manage'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Manage Bank ({questions.length})</span>
          </button>
        </div>
      </div>

      {/* ===================== PLAY TAB ===================== */}
      {activeTab === 'play' && (
        <>
          {quizState === 'idle' && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <span className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <Award className="w-7 h-7" />
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Site Engineer Exam Simulation
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Challenge yourself across standard IS codes, field tests, concrete technology, and survey practices.
                </p>
              </div>

              {/* Quiz Configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Subject Domain
                  </label>
                  <select
                    id="quiz-category-select"
                    value={quizCategory}
                    onChange={(e) => setQuizCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="All">All Engineering Domains</option>
                    {uniqueCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Timer per Question
                  </label>
                  <select
                    id="quiz-timer-select"
                    value={timerSeconds}
                    onChange={(e) => setTimerSeconds(parseInt(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                  >
                    <option value={20}>20 Seconds (Speed Test)</option>
                    <option value={30}>30 Seconds (Standard)</option>
                    <option value={45}>45 Seconds (Relaxed)</option>
                    <option value={60}>60 Seconds (Full Review)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-start space-x-3 text-xs text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">
                    {questions.filter((q) => quizCategory === 'All' || q.category === quizCategory).length} questions available
                  </span>
                  <span>Instant explanation breakdown provided after submission. Your score is tracked locally.</span>
                </div>
              </div>

              <button
                id="quiz-start-btn"
                type="button"
                onClick={startQuiz}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Start Assessment Now</span>
              </button>
            </div>
          )}

          {/* ACTIVE QUIZ SCREEN */}
          {quizState === 'running' && currentQ && (
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-3xl mx-auto space-y-6">
              {/* Progress & Live Timer Bar */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                <span className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono-calc">
                    Question {currentIndex + 1} of {selectedQuestions.length}
                  </span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    {currentQ.category}
                  </span>
                </span>

                <div
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full font-mono-calc font-bold text-xs ${
                    timeLeft <= 10
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 animate-pulse'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{timeLeft}s</span>
                </div>
              </div>

              {/* Linear Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / selectedQuestions.length) * 100}%`,
                  }}
                />
              </div>

              {/* Question Text */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-500">
                  {currentQ.difficulty} Difficulty
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                  {currentQ.question}
                </h3>
              </div>

              {/* 4 Options Grid */}
              <div className="space-y-3">
                {currentQ.options.map((opt, optIndex) => {
                  const isSelected = userAnswers[currentQ.id] === optIndex;
                  return (
                    <button
                      key={optIndex}
                      type="button"
                      onClick={() => handleSelectAnswer(optIndex)}
                      className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-white shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span
                          className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                            isSelected
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Navigation Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handlePreviousQuestion}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                >
                  Previous
                </button>

                <div className="flex items-center space-x-2">
                  {currentIndex === selectedQuestions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setQuizState('finished')}
                      className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
                    >
                      Submit Exam
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
                    >
                      Next Question
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* FINISHED RESULTS & EXPLANATION REVIEW */}
          {quizState === 'finished' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Score Header Card */}
              <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    Assessment Completed!
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Review your results and detailed civil engineering solutions below.
                  </p>
                </div>

                {/* Score Big Display */}
                <div className="flex items-center justify-center space-x-4 py-3">
                  <div className="text-center">
                    <span className="text-4xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400 font-mono-calc">
                      {scoreStats.score}
                    </span>
                    <span className="text-xl font-bold text-slate-400"> / {scoreStats.total}</span>
                    <div className="text-xs font-bold text-slate-500 mt-1">
                      Final Score ({scoreStats.percentage}%)
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-3">
                  <button
                    type="button"
                    onClick={startQuiz}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retake Quiz</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuizState('idle')}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"
                  >
                    Change Parameters
                  </button>
                </div>
              </div>

              {/* Detailed Question Review List */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Detailed Solutions & Civil Engineering Explanations
                </h4>

                {selectedQuestions.map((q, idx) => {
                  const userAnswer = userAnswers[q.id];
                  const isCorrect = userAnswer === q.correctOption;

                  return (
                    <div
                      key={q.id}
                      className={`p-6 rounded-2xl border transition-all ${
                        isCorrect
                          ? 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-800/60'
                          : 'bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-800/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                              isCorrect
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-500">{q.category}</span>
                        </div>

                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 ${
                            isCorrect
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Correct</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>Incorrect</span>
                            </>
                          )}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                        {q.question}
                      </h4>

                      {/* Options state */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-xs">
                        {q.options.map((opt, oIdx) => {
                          const isRight = oIdx === q.correctOption;
                          const isUserPick = oIdx === userAnswer;
                          return (
                            <div
                              key={oIdx}
                              className={`p-2.5 rounded-lg border font-medium flex items-center justify-between ${
                                isRight
                                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-300 font-bold'
                                  : isUserPick
                                  ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-300'
                                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              <span>
                                {String.fromCharCode(65 + oIdx)}. {opt}
                              </span>
                              {isRight && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation box */}
                      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                          Civil Engineering Solution & IS Code Reference:
                        </span>
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* ===================== MANAGE (CRUD) TAB ===================== */}
      {activeTab === 'manage' && (
        <div className="space-y-5">
          {/* Top Actions for CRUD */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Question Bank Management (CRUD)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                All questions persist in your browser LocalStorage. Add custom questions for your university, site, or exam.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleResetQuestions}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                title="Reset to default seeded questions"
              >
                Reset Default Bank
              </button>
              <button
                type="button"
                onClick={handleOpenAddForm}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question</span>
              </button>
            </div>
          </div>

          {/* Form Modal / Inline Editor */}
          {isFormOpen && (
            <form
              onSubmit={handleSaveQuestionForm}
              className="p-6 bg-white dark:bg-slate-900 rounded-2xl border-2 border-emerald-500 shadow-lg space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {editingQuestion ? 'Edit Question' : 'Create New MCQ Question'}
                </h4>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Question Text
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g. What is the standard nominal cover for RCC column reinforcement as per IS 456:2000?"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Domain / Category
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Concrete Technology, Surveying, RCC"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard',
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* 4 Options */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Multiple Choice Options & Select Correct Answer
                </label>
                {formData.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="correctOptionRadio"
                      checked={formData.correctOption === oIdx}
                      onChange={() => setFormData({ ...formData, correctOption: oIdx })}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      title="Mark as correct answer"
                    />
                    <span className="text-xs font-bold text-slate-500 w-4">
                      {String.fromCharCode(65 + oIdx)}:
                    </span>
                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...formData.options];
                        newOpts[oIdx] = e.target.value;
                        setFormData({ ...formData, options: newOpts });
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                ))}
              </div>

              {/* Detailed Explanation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Explanation & IS Code Reference
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Explain why the option is correct, citing relevant engineering mechanics, formulas, or standard codes."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingQuestion ? 'Update Question' : 'Save Question'}</span>
                </button>
              </div>
            </form>
          )}

          {/* List of Questions */}
          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold flex items-center justify-center text-slate-600 dark:text-slate-300">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {q.category}
                    </span>
                    <span className="text-[10px] text-slate-400">• {q.difficulty}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {q.question}
                  </h4>

                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    <div className="font-semibold text-emerald-700 dark:text-emerald-400">
                      Correct: {String.fromCharCode(65 + q.correctOption)}. {q.options[q.correctOption]}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 italic">
                      {q.explanation}
                    </div>
                  </div>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex items-center space-x-1 shrink-0 self-end sm:self-start">
                  <button
                    type="button"
                    onClick={() => handleOpenEditForm(q)}
                    className="p-2 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Edit Question"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
