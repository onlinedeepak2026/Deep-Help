import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { FeedbackItem } from '../types';
import {
  X,
  Star,
  MessageSquareHeart,
  Send,
  CheckCircle2,
  Mail,
  Lightbulb,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitFeedback: (item: Omit<FeedbackItem, 'id' | 'timestamp' | 'helpfulCount'>) => void;
  founderEmail?: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmitFeedback,
  founderEmail = 'deepak2OO61122@gmail.com',
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('Site Engineer');
  const [category, setCategory] = useState<FeedbackItem['category']>('Appreciation');
  const [message, setMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSubmitFeedback({
      name: name.trim() || 'Anonymous Engineer',
      email: email.trim(),
      role: role || 'Civil Engineer',
      rating,
      category,
      message: message.trim(),
    });

    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
    });

    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setMessage('');
    setName('');
    setEmail('');
    onClose();
  };

  const sendDirectEmail = () => {
    const subject = encodeURIComponent(`[Deep Help Feedback - ${category}] from ${name || 'User'}`);
    const body = encodeURIComponent(
      `Rating: ${rating}/5 Stars\nCategory: ${category}\nRole: ${role}\nName: ${name}\nEmail: ${email}\n\nFeedback / Message:\n${message}`
    );
    window.open(`mailto:${founderEmail}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-amber-500/10 dark:bg-amber-500/5">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-sm">
              <MessageSquareHeart className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Share Your Feedback & Review
              </h3>
              <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                Deep Help - Civil Engineering Hub • Er. Deepak Kumar
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                धन्यवाद! Thank You for Your Feedback!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                Your valuable review and feedback have been successfully saved to our community board.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                type="button"
                onClick={sendDirectEmail}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>Also Email Er. Deepak Kumar</span>
              </button>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Star Rating Selector */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-1.5">
              <span className="font-bold text-slate-700 dark:text-slate-300 block text-xs">
                How would you rate Deep Help Hub? (रेटिंग चुनें)
              </span>
              <div className="flex items-center justify-center space-x-1.5 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating || rating) >= star
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400">
                {rating === 5 && '⭐⭐⭐⭐⭐ 5/5 - Outstanding Civil Toolkit'}
                {rating === 4 && '⭐⭐⭐⭐ 4/5 - Very Helpful'}
                {rating === 3 && '⭐⭐⭐ 3/5 - Good & Useful'}
                {rating === 2 && '⭐⭐ 2/5 - Needs Improvement'}
                {rating === 1 && '⭐ 1/5 - Unsatisfactory'}
              </span>
            </div>

            {/* Category selection */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Feedback Category (सुझाव का प्रकार):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {[
                  { id: 'Appreciation', label: 'Appreciation / प्रशंसा' },
                  { id: 'Feature Request', label: 'Feature Request / नया फीचर' },
                  { id: 'Accuracy', label: 'Accuracy / गणना सटीकता' },
                  { id: 'Suggestion', label: 'Suggestion / सुझाव' },
                  { id: 'Bug Report', label: 'Bug / सुधार' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id as FeedbackItem['category'])}
                    className={`px-2.5 py-2 rounded-xl text-[11px] font-bold text-center border transition-all ${
                      category === item.id
                        ? 'bg-amber-500/15 border-amber-500 text-amber-800 dark:text-amber-300 font-extrabold'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Name & Role Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                  Your Name (आपका नाम):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Er. Rahul Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                  Designation / Role (पेशा):
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Site Engineer">Site Engineer</option>
                  <option value="Civil Engineering Student">Civil Engineering Student</option>
                  <option value="Junior Engineer (JE)">Junior Engineer (JE / AE)</option>
                  <option value="Structural Consultant">Structural Consultant</option>
                  <option value="Quantity Surveyor / Estimator">Quantity Surveyor / Estimator</option>
                  <option value="Civil Contractor">Civil Contractor</option>
                  <option value="Lecturer / Professor">Lecturer / Professor</option>
                  <option value="Other Civil Professional">Other</option>
                </select>
              </div>
            </div>

            {/* Email (Optional) */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Email Address (Optional - यदि उत्तर चाहते हैं):
              </label>
              <input
                type="email"
                placeholder="your.email@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Detailed Message */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Your Feedback / Suggestion (अपना विचार या सुझाव लिखें):
              </label>
              <textarea
                rows={3}
                required
                placeholder="Write your experience, suggestion, or request for new civil engineering features..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2.5 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!message.trim()}
                className="flex-1 inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Feedback (फीडबैक भेजें)</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
