'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import TierBadge from '@/components/TierBadge';
import {
  formatPoints,
  getTierForPercentile,
  getInitials,
} from '@/lib/utils';

export default function LeaderboardPage() {
  const { members, currentUser } = useApp();

  const sorted = useMemo(
    () => [...members].sort((a, b) => b.points - a.points),
    [members]
  );

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
          THE WALL
        </h1>
        <p className="text-sm text-cmax-muted mt-1">
          {members.length} climbers ranked by points
        </p>
      </motion.div>

      {/* Top 3 Podium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-2 mb-6"
      >
        {[sorted[1], sorted[0], sorted[2]].map((member, i) => {
          const displayRank = [2, 1, 3][i];
          const isFirst = displayRank === 1;
          return (
            <div
              key={member.id}
              className={`border bg-cmax-darker p-3 text-center relative ${
                isFirst
                  ? 'border-cmax-olive -mt-2 pb-5'
                  : 'border-cmax-gray mt-2'
              }`}
            >
              {isFirst && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cmax-olive text-black font-heading font-black text-[10px] px-3 py-0.5 tracking-wider">
                  #1
                </div>
              )}
              <div
                className={`w-10 h-10 mx-auto border flex items-center justify-center font-heading font-bold text-sm ${
                  isFirst
                    ? 'border-cmax-olive text-cmax-olive'
                    : 'border-cmax-gray text-cmax-muted'
                }`}
              >
                {getInitials(member.name)}
              </div>
              <div className="font-heading font-bold text-xs mt-2 truncate">
                {member.name.split(' ')[0]}
              </div>
              <div
                className={`font-heading font-extrabold text-sm mt-1 ${
                  isFirst ? 'text-cmax-olive' : 'text-cmax-muted'
                }`}
              >
                {formatPoints(member.points)}
              </div>
              {!isFirst && (
                <div className="text-[10px] text-cmax-muted font-heading font-bold mt-1">
                  #{displayRank}
                </div>
              )}
            </div>
          );
        })}
      </motion.div>

      {/* Full Rankings */}
      <div className="border border-cmax-gray divide-y divide-cmax-gray">
        {sorted.map((member, i) => {
          const rank = i + 1;
          const isCurrentUser = member.id === currentUser.id;
          const tierPosition = getTierForPercentile(rank, sorted.length);

          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.02 }}
              className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                isCurrentUser
                  ? 'bg-cmax-olive-muted border-l-2 border-l-cmax-olive'
                  : 'bg-cmax-darker hover:bg-cmax-dark'
              }`}
            >
              {/* Rank */}
              <div
                className={`w-8 text-center font-heading font-extrabold text-sm ${
                  tierPosition === 'top'
                    ? 'text-cmax-olive'
                    : tierPosition === 'bottom'
                    ? 'text-cmax-muted/50'
                    : 'text-cmax-muted'
                }`}
              >
                {rank}
              </div>

              {/* Avatar */}
              <div
                className={`w-8 h-8 border flex items-center justify-center font-heading font-bold text-[10px] flex-shrink-0 ${
                  isCurrentUser
                    ? 'border-cmax-olive text-cmax-olive'
                    : 'border-cmax-gray text-cmax-muted'
                }`}
              >
                {getInitials(member.name)}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <div
                  className={`text-sm font-medium truncate ${
                    isCurrentUser ? 'text-cmax-olive' : 'text-white'
                  }`}
                >
                  {member.name}
                  {isCurrentUser && (
                    <span className="text-[10px] text-cmax-olive ml-2 font-heading tracking-wider">
                      YOU
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-cmax-muted">
                  <TierBadge points={member.points} size="sm" />
                </div>
              </div>

              {/* Points */}
              <div
                className={`font-heading font-extrabold text-sm text-right ${
                  tierPosition === 'top'
                    ? 'text-cmax-olive'
                    : 'text-cmax-muted'
                }`}
              >
                {formatPoints(member.points)}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
