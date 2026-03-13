'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { ACTIVITY_CONFIG, ActivityType, Member } from '@/data/mock';
import { formatPoints, getInitials } from '@/lib/utils';

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

export default function AdminPage() {
  const { members, activities, awardPoints } = useApp();
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [search, setSearch] = useState('');
  const [lastAwarded, setLastAwarded] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...members].sort((a, b) => b.points - a.points),
    [members]
  );

  const filtered = useMemo(() => {
    if (!search) return sorted;
    const q = search.toLowerCase();
    return sorted.filter((m) => m.name.toLowerCase().includes(q));
  }, [sorted, search]);

  const recentActivity = useMemo(
    () => activities.slice(0, 8),
    [activities]
  );

  const totalPoints = useMemo(
    () => members.reduce((sum, m) => sum + m.points, 0),
    [members]
  );

  const handleAward = (type: ActivityType, points: number) => {
    if (!selectedMember) return;
    const config = ACTIVITY_CONFIG[type];
    awardPoints(selectedMember.id, type, points, config.label);
    setLastAwarded(
      `+${points} to ${selectedMember.name.split(' ')[0]} for ${config.label}`
    );
    setTimeout(() => setLastAwarded(null), 3000);
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
          ADMIN
        </h1>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-2 mb-6"
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

      {/* Member Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
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

        {/* Member List */}
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
          <div className="grid grid-cols-3 gap-2">
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

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
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
    </div>
  );
}
