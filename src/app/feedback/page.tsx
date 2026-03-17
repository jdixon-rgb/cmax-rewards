'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type FeedbackType = 'suggestion' | 'bug';

function FeedbackPageInner() {
  const searchParams = useSearchParams();
  const isEmbedded = searchParams.get('embedded') === 'true';
  const homeHref = isEmbedded ? '/?embedded=true' : '/';

  const [type, setType] = useState<FeedbackType>('suggestion');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!message.trim()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 lg:px-8 pt-6 lg:pt-10 flex flex-col items-center justify-center min-h-[70dvh]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          {/* Checkmark */}
          <div className="w-16 h-16 border-2 border-cmax-olive mx-auto mb-4 flex items-center justify-center glow-olive">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#b8b455" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="font-heading font-black text-2xl tracking-tight mb-2">
            Thank you!
          </h2>
          <p className="text-sm text-cmax-muted mb-6">
            Your {type === 'suggestion' ? 'suggestion' : 'bug report'} has been received.
          </p>
          <Link
            href={homeHref}
            className="inline-block px-6 py-3 border border-cmax-gray text-sm font-heading font-bold tracking-wider text-cmax-muted hover:border-cmax-olive hover:text-cmax-olive transition-colors uppercase"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 lg:px-8 pt-6 lg:pt-10">
      {/* Back + Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Link
          href={homeHref}
          className="inline-flex items-center gap-2 text-cmax-muted hover:text-cmax-olive transition-colors mb-4"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span className="font-heading text-xs font-bold tracking-wider uppercase">Back</span>
        </Link>
        <div className="font-heading font-black text-xs tracking-[0.3em] text-cmax-muted uppercase">
          CMAX Rewards
        </div>
        <h1 className="font-heading font-black text-3xl tracking-tight mt-1">
          FEEDBACK
        </h1>
      </motion.div>

      {/* Type Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 gap-3 mb-6"
      >
        <button
          onClick={() => setType('suggestion')}
          className={`border-2 p-4 text-center transition-all ${
            type === 'suggestion'
              ? 'border-cmax-olive bg-cmax-olive-muted glow-olive'
              : 'border-cmax-gray bg-cmax-darker hover:border-cmax-gray-light'
          }`}
        >
          {/* Lightbulb */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke={type === 'suggestion' ? '#b8b455' : '#777'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-2"
          >
            <path d="M9 18h6" />
            <path d="M10 22h4" />
            <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
          </svg>
          <div className={`font-heading font-bold text-xs tracking-wider uppercase ${
            type === 'suggestion' ? 'text-cmax-olive' : 'text-cmax-muted'
          }`}>
            Suggestion
          </div>
        </button>

        <button
          onClick={() => setType('bug')}
          className={`border-2 p-4 text-center transition-all ${
            type === 'bug'
              ? 'border-cmax-olive bg-cmax-olive-muted glow-olive'
              : 'border-cmax-gray bg-cmax-darker hover:border-cmax-gray-light'
          }`}
        >
          {/* Bug */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke={type === 'bug' ? '#b8b455' : '#777'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-2"
          >
            <path d="M8 2l1.88 1.88" />
            <path d="M14.12 3.88L16 2" />
            <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
            <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
            <path d="M12 20v-9" />
            <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
            <path d="M6 13H2" />
            <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
            <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
            <path d="M22 13h-4" />
            <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
          </svg>
          <div className={`font-heading font-bold text-xs tracking-wider uppercase ${
            type === 'bug' ? 'text-cmax-olive' : 'text-cmax-muted'
          }`}>
            Report Bug
          </div>
        </button>
      </motion.div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="font-heading font-bold text-xs tracking-[0.15em] text-cmax-muted uppercase mb-2">
          Your Message
        </div>
        <textarea
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            type === 'suggestion'
              ? 'Tell us your idea and how it would help...'
              : 'Describe what happened, what you expected, and the steps to reproduce...'
          }
          className="w-full bg-cmax-darker border border-cmax-gray px-4 py-3 text-sm text-white placeholder-cmax-muted/50 outline-none focus:border-cmax-olive transition-colors font-body resize-none"
        />
      </motion.div>

      {/* Submit */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <button
          onClick={handleSubmit}
          disabled={!message.trim()}
          className={`w-full py-4 font-heading font-black text-sm tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-colors ${
            message.trim()
              ? 'bg-cmax-olive text-black hover:bg-cmax-olive-light'
              : 'bg-cmax-gray text-cmax-muted cursor-not-allowed'
          }`}
        >
          {/* Send icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          Submit
        </button>
      </motion.div>
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={null}>
      <FeedbackPageInner />
    </Suspense>
  );
}
