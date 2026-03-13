'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import {
  members as initialMembers,
  activities as initialActivities,
  CURRENT_USER_ID,
  Member,
  Activity,
  ActivityType,
} from '@/data/mock';

interface AppContextType {
  members: Member[];
  currentUser: Member;
  activities: Activity[];
  awardPoints: (
    memberId: number,
    type: ActivityType,
    points: number,
    description: string
  ) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState(initialMembers);
  const [activities, setActivities] = useState(initialActivities);

  const currentUser = members.find((m) => m.id === CURRENT_USER_ID)!;

  const awardPoints = useCallback(
    (
      memberId: number,
      type: ActivityType,
      points: number,
      description: string
    ) => {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === memberId ? { ...m, points: m.points + points } : m
        )
      );
      setActivities((prev) => [
        {
          id: Date.now(),
          memberId,
          type,
          points,
          description,
          date: new Date().toISOString().split('T')[0],
        },
        ...prev,
      ]);
    },
    []
  );

  return (
    <AppContext.Provider
      value={{ members, currentUser, activities, awardPoints }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
