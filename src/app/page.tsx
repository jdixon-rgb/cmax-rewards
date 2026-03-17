'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { ACTIVITY_CONFIG } from '@/data/mock';
import TierBadge from '@/components/TierBadge';
import { formatPoints, getPercentile, formatDate } from '@/lib/utils';

export default function Dashboard() {
  const { currentUser, members, activities } = useApp();

  const userActivities = useMemo(
    () => activities.filter((a) => a.memberId === currentUser.id),
    [activities, currentUser.id]
  );

  const sorted = useMemo(
    () => [...members].sort((a, b) => b.points - a.points),
    [members]
  );

  const rank = sorted.findIndex((m) => m.id === currentUser.id) + 1;
  const percentile = getPercentile(rank, members.length);

  return (
    <div className="max-w-lg lg:max-w-5xl mx-auto px-4 lg:px-8 pt-6 lg:pt-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 lg:mb-8"
      >
        <div className="font-heading font-black text-xs tracking-[0.3em] text-cmax-muted uppercase">
          CMAX Rewards
        </div>
        <h1 className="font-heading font-black text-2xl lg:text-3xl tracking-tight mt-1">
          Welcome back,{' '}
          <span className="text-cmax-olive">
            {currentUser.name.split(' ')[0]}
          </span>
        </h1>
      </motion.div>

      {/* Desktop: two-column layout */}
      <div className="lg:grid lg:grid-cols-5 lg:gap-8">
        {/* Left Column - Points + Actions */}
        <div className="lg:col-span-2">
          {/* Points Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border-2 border-cmax-gray bg-cmax-darker p-6 mb-4 relative overflow-hidden"
          >
            <div className="stripe-accent absolute inset-0 pointer-events-none" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-heading font-bold text-[10px] tracking-[0.2em] text-cmax-muted uppercase mb-2">
                    Your Points
                  </div>
                  <div className="font-heading font-black text-5xl text-cmax-olive glow-olive-text leading-none">
                    {formatPoints(currentUser.points)}
                  </div>
                </div>
                <TierBadge points={currentUser.points} />
              </div>

              <div className="flex gap-6 mt-5 pt-4 border-t border-cmax-gray">
                <div>
                  <div className="font-heading font-bold text-[10px] tracking-[0.2em] text-cmax-muted uppercase">
                    Rank
                  </div>
                  <div className="font-heading font-extrabold text-xl text-white">
                    #{rank}
                    <span className="text-cmax-muted text-sm font-normal ml-1">
                      / {members.length}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="font-heading font-bold text-[10px] tracking-[0.2em] text-cmax-muted uppercase">
                    Percentile
                  </div>
                  <div className="font-heading font-extrabold text-xl text-white">
                    Top {100 - percentile + 1}%
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-3 gap-2 mb-6"
          >
            {[
              { label: 'Check In', pts: '+10', type: 'attendance' },
              { label: 'Share Link', pts: '+50', type: 'share_link' },
              { label: 'View Raffle', pts: null, type: 'raffle' },
            ].map((action) => (
              <button
                key={action.label}
                className="border border-cmax-gray bg-cmax-dark p-3 text-center hover:border-cmax-olive transition-colors group"
              >
                <div className="font-heading font-bold text-[10px] tracking-wider text-cmax-muted group-hover:text-cmax-olive uppercase transition-colors">
                  {action.label}
                </div>
                {action.pts && (
                  <div className="font-heading font-extrabold text-cmax-olive text-sm mt-1">
                    {action.pts}
                  </div>
                )}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Right Column - Activity Feed */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading font-bold text-sm tracking-[0.15em] uppercase">
                Recent Activity
              </h2>
              <span className="text-[10px] text-cmax-muted font-heading tracking-wider uppercase">
                {userActivities.length} entries
              </span>
            </div>

            <div className="border border-cmax-gray divide-y divide-cmax-gray">
              {userActivities.slice(0, 10).map((activity, i) => {
                const config = ACTIVITY_CONFIG[activity.type];
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.04 }}
                    className="flex items-center justify-between px-4 py-3 bg-cmax-darker hover:bg-cmax-dark transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 border border-cmax-gray flex items-center justify-center font-heading font-bold text-xs text-cmax-muted">
                        {config.icon}
                      </div>
                      <div>
                        <div className="text-sm text-white">
                          {activity.description}
                        </div>
                        <div className="text-[11px] text-cmax-muted">
                          {formatDate(activity.date)}
                        </div>
                      </div>
                    </div>
                    <div className="font-heading font-extrabold text-cmax-olive text-sm">
                      +{activity.points}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
