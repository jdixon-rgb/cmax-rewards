'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { ACTIVITY_CONFIG, ActivityType, Member } from '@/data/mock';
import { formatPoints, getInitials } from '@/lib/utils';

type AdminTab = 'points' | 'draw';

const QUICK_ACTIONS: { type: ActivityType; label: string; points: number }[] = [
  { type: 'attendance', label: 'Attendance', points: 10 },
  { type: 'membership', label: 'Membership', points: 100 },
  { type: 'pre_registration', label: 'Pre-Reg', points: 50 },
  { type: 'event_attendance', label: 'Event', points: 50 },
  { type: 'competition', label: 'Competition', points: 100 },
  { type: 'class', label: 'Class', points: 200 },
  { type: 'follow_fb', label: 'Follow FB', points: 200 },
  { type: 'follow_ig', label: 'Follow IG', points: 500 },
  { type: 'share_link', label: 'Share Link', points: 50 },
  { type: 'merch_video', label: 'Merch Video', points: 200 },
  { type: 'charity', label: 'Charity', points: 200 },
  { type: 'volunteer', label: 'Volunteer', points: 1000 },
];

/* ─── Raffle constants ─── */
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

/* ═══════════════════════════════════════════════ */

export default function AdminPage() {
  const { members, activities, awardPoints } = useApp();
  const [tab, setTab] = useState<AdminTab>('points');

  /* ─── Points tab state ─── */
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [search, setSearch] = useState('');
  const [lastAwarded, setLastAwarded] = useState<string | null>(null);

  /* ─── Draw tab state ─── */
  const [phase, setPhase] = useState<Phase>('idle');
  const [countdown, setCountdown] = useState(3);
  const [displayNames, setDisplayNames] = useState(['- - -', '- - -', '- - -']);
  const [revealed, setRevealed] = useState([false, false, false]);
  const [winners, setWinners] = useState<Member[]>([]);
  const animRunning = useRef(false);
  const namesRef = useRef(['- - -', '- - -', '- - -']);

  /* ─── Shared derived data ─── */
  const sorted = useMemo(
    () => [...members].sort((a, b) => b.points - a.points),
    [members]
  );

  const filtered = useMemo(() => {
    if (!search) return sorted;
    const q = search.toLowerCase();
    return sorted.filter((m) => m.name.toLowerCase().includes(q));
  }, [sorted, search]);

  const recentActivity = useMemo(() => activities.slice(0, 8), [activities]);

  const totalPoints = useMemo(
    () => members.reduce((sum, m) => sum + m.points, 0),
    [members]
  );

  /* ─── Raffle pools ─── */
  const topCutoff = Math.max(2, Math.ceil(sorted.length * 0.05));
  const bottomCutoff = Math.max(2, Math.ceil(sorted.length * 0.05));

  const pools = useMemo(
    () => [
      sorted.slice(sorted.length - bottomCutoff),
      sorted.slice(topCutoff, sorted.length - bottomCutoff),
      sorted.slice(0, topCutoff),
    ],
    [sorted, topCutoff, bottomCutoff]
  );

  /* ─── Points handlers ─── */
  const handleAward = (type: ActivityType, points: number) => {
    if (!selectedMember) return;
    const config = ACTIVITY_CONFIG[type];
    awardPoints(selectedMember.id, type, points, config.label);
    setLastAwarded(
      `+${points} to ${selectedMember.name.split(' ')[0]} for ${config.label}`
    );
    setTimeout(() => setLastAwarded(null), 3000);
  };

  /* ─── Raffle countdown ─── */
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

  /* ─── Raffle animation ─── */
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
          const changeRate = 40 + 360 * Math.pow(progress, 3);
          if (Math.random() < 40 / changeRate) {
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

    return () => clearInterval(intervalId);
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

  const resetDraw = () => {
    setPhase('idle');
    setRevealed([false, false, false]);
    namesRef.current = ['- - -', '- - -', '- - -'];
    setDisplayNames(['- - -', '- - -', '- - -']);
    setWinners([]);
    animRunning.current = false;
  };

  /* ═══════════════════════════════════════════════ */

  return (
    <div className="max-w-lg lg:max-w-5xl mx-auto px-4 lg:px-8 pt-6 lg:pt-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <div className="font-heading font-black text-xs tracking-[0.3em] text-cmax-muted uppercase">
          CMAX Rewards
        </div>
        <h1 className="font-heading font-black text-3xl tracking-tight mt-1">
          ADMIN
        </h1>
      </motion.div>

      {/* Tab Switcher */}
      <div className="flex border-b-2 border-cmax-gray mb-6">
        {(['points', 'draw'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 font-heading font-bold text-xs tracking-[0.2em] uppercase text-center transition-colors ${
              tab === t
                ? 'text-cmax-olive border-b-2 border-cmax-olive -mb-[2px]'
                : 'text-cmax-muted hover:text-white'
            }`}
          >
            {t === 'points' ? 'AWARD POINTS' : 'RAFFLE DRAW'}
          </button>
        ))}
      </div>

      {/* ─── POINTS TAB ─── */}
      {tab === 'points' && (
        <>
          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-2 lg:gap-3 mb-6"
          >
            <div className="border border-cmax-gray bg-cmax-darker p-3 text-center">
              <div className="font-heading font-bold text-[10px] tracking-wider text-cmax-muted uppercase">
                Members
              </div>
              <div className="font-heading font-extrabold text-xl text-white mt-1">
                {members.length}
              </div>
            </div>
            <div className="border border-cmax-gray bg-cmax-darker p-3 text-center">
              <div className="font-heading font-bold text-[10px] tracking-wider text-cmax-muted uppercase">
                Total Pts
              </div>
              <div className="font-heading font-extrabold text-xl text-cmax-olive mt-1">
                {formatPoints(totalPoints)}
              </div>
            </div>
            <div className="border border-cmax-gray bg-cmax-darker p-3 text-center">
              <div className="font-heading font-bold text-[10px] tracking-wider text-cmax-muted uppercase">
                Activity
              </div>
              <div className="font-heading font-extrabold text-xl text-white mt-1">
                {activities.length}
              </div>
            </div>
          </motion.div>

          {/* Desktop: two-column layout for member + actions */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Member Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-4"
          >
            <div className="font-heading font-bold text-xs tracking-[0.15em] text-cmax-muted uppercase mb-2">
              Select Member
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name..."
              className="w-full bg-cmax-darker border border-cmax-gray px-4 py-3 text-sm text-white placeholder-cmax-muted/50 outline-none focus:border-cmax-olive transition-colors font-body"
            />
            <div className="border border-t-0 border-cmax-gray max-h-48 overflow-y-auto">
              {filtered.slice(0, 10).map((member) => (
                <button
                  key={member.id}
                  onClick={() => {
                    setSelectedMember(member);
                    setSearch('');
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${
                    selectedMember?.id === member.id
                      ? 'bg-cmax-olive-muted border-l-2 border-l-cmax-olive'
                      : 'bg-cmax-darker hover:bg-cmax-dark'
                  }`}
                >
                  <div className="w-7 h-7 border border-cmax-gray flex items-center justify-center font-heading font-bold text-[10px] text-cmax-muted flex-shrink-0">
                    {getInitials(member.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{member.name}</div>
                  </div>
                  <div className="font-heading font-bold text-xs text-cmax-muted">
                    {formatPoints(member.points)}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Selected Member + Quick Actions */}
          <div>
          {selectedMember && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="border-2 border-cmax-olive bg-cmax-darker p-4 mb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-heading font-bold text-sm text-cmax-olive">
                      {selectedMember.name}
                    </div>
                    <div className="text-xs text-cmax-muted mt-0.5">
                      {formatPoints(selectedMember.points)} points
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="text-cmax-muted hover:text-white text-xs font-heading tracking-wider"
                  >
                    CLEAR
                  </button>
                </div>
              </div>

              <div className="font-heading font-bold text-xs tracking-[0.15em] text-cmax-muted uppercase mb-2">
                Quick Award
              </div>
              <div className="grid grid-cols-3 lg:grid-cols-4 gap-2">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.type}
                    onClick={() => handleAward(action.type, action.points)}
                    className="border border-cmax-gray bg-cmax-darker p-2 text-center hover:border-cmax-olive hover:bg-cmax-dark transition-colors group"
                  >
                    <div className="font-heading font-bold text-[10px] tracking-wider text-cmax-muted group-hover:text-white uppercase transition-colors truncate">
                      {action.label}
                    </div>
                    <div className="font-heading font-extrabold text-cmax-olive text-xs mt-0.5">
                      +{action.points}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* No member selected placeholder for desktop right column */}
          {!selectedMember && (
            <div className="hidden lg:flex items-center justify-center border border-dashed border-cmax-gray bg-cmax-darker p-8 text-center">
              <div className="text-sm text-cmax-muted">
                Select a member to award points
              </div>
            </div>
          )}
          </div>
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="font-heading font-bold text-xs tracking-[0.15em] text-cmax-muted uppercase mb-2">
              Recent Activity (All)
            </div>
            <div className="border border-cmax-gray divide-y divide-cmax-gray">
              {recentActivity.map((activity) => {
                const member = members.find((m) => m.id === activity.memberId);
                return (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between px-4 py-2 bg-cmax-darker text-sm"
                  >
                    <div>
                      <span className="text-cmax-muted text-xs">
                        {member?.name}
                      </span>
                      <span className="text-cmax-muted mx-2">-</span>
                      <span className="text-white text-xs">
                        {activity.description}
                      </span>
                    </div>
                    <div className="font-heading font-bold text-cmax-olive text-xs flex-shrink-0 ml-2">
                      +{activity.points}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}

      {/* ─── DRAW TAB ─── */}
      {tab === 'draw' && (
        <>
          <div className="lg:max-w-2xl lg:mx-auto">
          <p className="text-sm text-cmax-muted mb-6">
            Three tiers. Three winners. One epic moment.
          </p>

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
                transition={{ delay: 0.05 + i * 0.08 }}
              >
                <div
                  className={`border-2 bg-cmax-darker relative overflow-hidden transition-all duration-500 ${
                    revealed[i]
                      ? 'border-cmax-olive glow-olive'
                      : phase === 'drawing'
                      ? 'border-cmax-muted'
                      : 'border-cmax-muted/40'
                  }`}
                >
                  <div
                    className={`px-4 py-2 border-b font-heading font-black text-xs tracking-[0.2em] transition-colors duration-300 ${
                      revealed[i]
                        ? 'border-cmax-olive bg-cmax-olive text-black'
                        : 'border-cmax-muted/30 bg-cmax-dark text-cmax-muted'
                    }`}
                  >
                    {TIER_LABELS[i]}
                    <span className="font-body font-normal text-[10px] tracking-normal ml-2 opacity-60">
                      {TIER_DESCRIPTIONS[i]}
                    </span>
                  </div>

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

          {/* Draw Button */}
          <div className="mb-6">
            {phase === 'idle' ? (
              <button
                onClick={startDraw}
                className="w-full py-4 bg-cmax-olive text-black font-heading font-black text-lg tracking-[0.2em] uppercase hover:bg-cmax-olive-light transition-colors animate-pulse-glow"
              >
                START DRAW
              </button>
            ) : phase === 'complete' ? (
              <button
                onClick={resetDraw}
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
          </div>
          </div>
        </>
      )}

      {/* Toast */}
      {lastAwarded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-20 left-4 right-4 max-w-lg mx-auto bg-cmax-olive text-black font-heading font-bold text-sm text-center py-3 px-4 z-50"
        >
          {lastAwarded}
        </motion.div>
      )}
    </div>
  );
}
