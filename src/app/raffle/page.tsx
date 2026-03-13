'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { Member } from '@/data/mock';

type Phase = 'idle' | 'countdown' | 'drawing' | 'complete';

const PRIZES = ['Free Day Pass', 'CMAX Chalk Bag Bundle', '1 Month Free Membership'];
const TIER_LABELS = ['BASECAMP', 'THE CRAG', 'SUMMIT'];
const TIER_DESCRIPTIONS = ['Bottom Tier Draw', 'Mid Tier Draw', 'Top Tier Draw'];

function fireConfetti() {
  import('canvas-confetti').then((mod) => {
    const fire = mod.default;
    fire({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#b8b455', '#d4d080', '#ffffff', '#8a8740'],
    });
    setTimeout(() => {
      fire({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors: ['#b8b455', '#ffffff'] });
      fire({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors: ['#b8b455', '#ffffff'] });
    }, 200);
  });
}

export default function RafflePage() {
  const { members } = useApp();
  const [phase, setPhase] = useState<Phase>('idle');
  const [countdown, setCountdown] = useState(3);
  const [displayNames, setDisplayNames] = useState(['- - -', '- - -', '- - -']);
  const [revealed, setRevealed] = useState([false, false, false]);
  const [winners, setWinners] = useState<Member[]>([]);
  const animRunning = useRef(false);
  const namesRef = useRef(['- - -', '- - -', '- - -']);

  const sorted = useMemo(
    () => [...members].sort((a, b) => b.points - a.points),
    [members]
  );

  const topCutoff = Math.max(2, Math.ceil(sorted.length * 0.05));
  const bottomCutoff = Math.max(2, Math.ceil(sorted.length * 0.05));

  const pools = useMemo(
    () => [
      sorted.slice(sorted.length - bottomCutoff), // basecamp
      sorted.slice(topCutoff, sorted.length - bottomCutoff), // crag
      sorted.slice(0, topCutoff), // summit
    ],
    [sorted, topCutoff, bottomCutoff]
  );

  // Countdown
  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdown <= 0) {
      setPhase('drawing');
      setCountdown(3);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 800);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  // Main drawing animation using setInterval + refs
  useEffect(() => {
    if (phase !== 'drawing' || animRunning.current) return;
    animRunning.current = true;

    const stopDelays = [2500, 4000, 5500];
    const startTime = Date.now();
    const stopped = [false, false, false];
    const revealedLocal = [false, false, false];

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;

      for (let i = 0; i < 3; i++) {
        if (stopped[i]) continue;

        const progress = Math.min(elapsed / stopDelays[i], 1);

        if (progress >= 1) {
          stopped[i] = true;
          namesRef.current[i] = winners[i].name;
          revealedLocal[i] = true;
          setRevealed([...revealedLocal]);
        } else {
          // Vary speed: fast early, slow late
          const changeRate = 40 + 360 * Math.pow(progress, 3);
          if (Math.random() < (40 / changeRate)) {
            const pool = pools[i];
            namesRef.current[i] = pool[Math.floor(Math.random() * pool.length)].name;
          }
        }
      }

      setDisplayNames([...namesRef.current]);

      if (stopped.every(Boolean)) {
        clearInterval(intervalId);
        setTimeout(() => {
          setPhase('complete');
          fireConfetti();
          animRunning.current = false;
        }, 400);
      }
    }, 30);

    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const startDraw = () => {
    animRunning.current = false;
    namesRef.current = ['- - -', '- - -', '- - -'];
    setRevealed([false, false, false]);
    setDisplayNames(['- - -', '- - -', '- - -']);

    const pickedWinners = pools.map(
      (pool) => pool[Math.floor(Math.random() * pool.length)]
    );
    setWinners(pickedWinners);
    setPhase('countdown');
  };

  const reset = () => {
    setPhase('idle');
    setRevealed([false, false, false]);
    namesRef.current = ['- - -', '- - -', '- - -'];
    setDisplayNames(['- - -', '- - -', '- - -']);
    setWinners([]);
    animRunning.current = false;
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="font-heading font-black text-xs tracking-[0.3em] text-cmax-muted uppercase">
          CMAX Rewards
        </div>
        <h1 className="font-heading font-black text-3xl tracking-tight mt-1">
          THE DRAW
        </h1>
        <p className="text-sm text-cmax-muted mt-1">
          Three tiers. Three winners. One epic moment.
        </p>
      </motion.div>

      {/* Countdown Overlay */}
      <AnimatePresence>
        {phase === 'countdown' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/80 flex items-center justify-center"
          >
            <motion.div
              key={countdown}
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="font-heading font-black text-8xl text-cmax-olive glow-olive-text"
            >
              {countdown > 0 ? countdown : 'GO'}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slots */}
      <div className="space-y-3 mb-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
          >
            <div
              className={`border-2 bg-cmax-darker relative overflow-hidden transition-all duration-500 ${
                revealed[i]
                  ? 'border-cmax-olive glow-olive'
                  : phase === 'drawing'
                  ? 'border-cmax-gray-light'
                  : 'border-cmax-gray'
              }`}
            >
              {/* Tier Label */}
              <div
                className={`px-4 py-2 border-b font-heading font-black text-xs tracking-[0.2em] transition-colors duration-300 ${
                  revealed[i]
                    ? 'border-cmax-olive bg-cmax-olive text-black'
                    : 'border-cmax-gray bg-cmax-dark text-cmax-muted'
                }`}
              >
                {TIER_LABELS[i]}
                <span className="font-body font-normal text-[10px] tracking-normal ml-2 opacity-60">
                  {TIER_DESCRIPTIONS[i]}
                </span>
              </div>

              {/* Name Display */}
              <div className="px-4 py-8 text-center">
                <div
                  className={`font-heading font-extrabold text-xl transition-all duration-300 ${
                    revealed[i]
                      ? 'text-cmax-olive glow-olive-text'
                      : phase === 'drawing' && !revealed[i]
                      ? 'text-white'
                      : 'text-cmax-muted/40'
                  }`}
                  style={{
                    transform: revealed[i] ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.3s ease-out',
                  }}
                >
                  {displayNames[i]}
                </div>

                <AnimatePresence>
                  {revealed[i] && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-3 font-heading text-xs tracking-wider text-cmax-olive-light uppercase"
                    >
                      Wins: {PRIZES[i]}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {revealed[i] && (
                <div className="stripe-accent absolute inset-0 pointer-events-none" />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Winners Banner */}
      <AnimatePresence>
        {phase === 'complete' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-2 border-cmax-olive bg-cmax-darker p-6 text-center mb-6 glow-olive"
          >
            <div className="font-heading font-black text-2xl text-cmax-olive tracking-wider">
              WINNERS
            </div>
            <div className="mt-3 space-y-2">
              {winners.map((w, i) => (
                <div key={w.id} className="text-sm">
                  <span className="text-cmax-muted font-heading text-xs tracking-wider">
                    {TIER_LABELS[i]}
                  </span>{' '}
                  <span className="text-white font-bold">{w.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        {phase === 'idle' ? (
          <button
            onClick={startDraw}
            className="w-full py-4 bg-cmax-olive text-black font-heading font-black text-lg tracking-[0.2em] uppercase hover:bg-cmax-olive-light transition-colors animate-pulse-glow"
          >
            START DRAW
          </button>
        ) : phase === 'complete' ? (
          <button
            onClick={reset}
            className="w-full py-4 border-2 border-cmax-gray text-cmax-muted font-heading font-bold text-sm tracking-[0.2em] uppercase hover:border-cmax-olive hover:text-cmax-olive transition-colors"
          >
            DRAW AGAIN
          </button>
        ) : (
          <div className="w-full py-4 border-2 border-cmax-gray text-center">
            <div className="font-heading font-bold text-xs tracking-[0.2em] text-cmax-muted uppercase animate-pulse">
              Drawing...
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
