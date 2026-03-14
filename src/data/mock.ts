export interface Member {
  id: number;
  name: string;
  points: number;
  joinDate: string;
}

export interface Activity {
  id: number;
  memberId: number;
  type: ActivityType;
  points: number;
  description: string;
  date: string;
}

export type ActivityType =
  | 'attendance'
  | 'membership'
  | 'purchase'
  | 'pre_registration'
  | 'event_attendance'
  | 'competition'
  | 'follow_fb'
  | 'follow_ig'
  | 'share_link'
  | 'class'
  | 'merch_video'
  | 'charity'
  | 'volunteer';

export const ACTIVITY_CONFIG: Record<
  ActivityType,
  { points: number; label: string; icon: string }
> = {
  attendance: { points: 10, label: 'Gym Attendance', icon: 'A' },
  membership: { points: 100, label: 'Monthly Membership', icon: 'M' },
  purchase: { points: 1, label: 'Purchase (per $1)', icon: '$' },
  pre_registration: { points: 50, label: 'Event Pre-Registration', icon: 'R' },
  event_attendance: { points: 50, label: 'Event Attendance', icon: 'E' },
  competition: { points: 100, label: 'Competition Entry', icon: 'C' },
  follow_fb: { points: 200, label: 'Follow on Facebook', icon: 'F' },
  follow_ig: { points: 500, label: 'Follow on Instagram', icon: 'I' },
  share_link: { points: 50, label: 'Share Referral Link', icon: 'S' },
  class: { points: 200, label: 'Attend a Class', icon: 'L' },
  merch_video: { points: 200, label: 'Share Merch Video', icon: 'V' },
  charity: { points: 200, label: 'Charity Donation', icon: 'D' },
  volunteer: { points: 1000, label: 'Volunteer Program', icon: 'H' },
};

export const CURRENT_USER_ID = 12;

export const members: Member[] = [
  { id: 1, name: 'Marcus Chen', points: 15420, joinDate: '2024-08-15' },
  { id: 2, name: 'Sarah Okonkwo', points: 12850, joinDate: '2024-07-20' },
  { id: 3, name: 'Jake Torres', points: 11200, joinDate: '2024-09-01' },
  { id: 4, name: 'Maya Patel', points: 9780, joinDate: '2024-06-12' },
  { id: 5, name: 'Devon Washington', points: 8340, joinDate: '2024-10-05' },
  { id: 6, name: 'Emma Lindberg', points: 7920, joinDate: '2024-08-30' },
  { id: 7, name: 'Kai Nakamura', points: 7100, joinDate: '2024-11-14' },
  { id: 8, name: 'Lucia Fernandez', points: 6850, joinDate: '2024-07-08' },
  { id: 9, name: 'Tyler Brooks', points: 5920, joinDate: '2024-09-22' },
  { id: 10, name: 'Aisha Johnson', points: 5440, joinDate: '2024-10-18' },
  { id: 11, name: 'Ryan O\'Brien', points: 4780, joinDate: '2024-12-01' },
  { id: 12, name: 'Sean Garner', points: 3540, joinDate: '2025-01-10' },
  { id: 13, name: 'Chris Martinez', points: 3210, joinDate: '2025-01-25' },
  { id: 14, name: 'Priya Sharma', points: 2890, joinDate: '2025-02-05' },
  { id: 15, name: 'Nate Collins', points: 2650, joinDate: '2025-02-14' },
  { id: 16, name: 'Sofia Reyes', points: 2340, joinDate: '2025-01-08' },
  { id: 17, name: 'Omar Hassan', points: 2100, joinDate: '2025-03-01' },
  { id: 18, name: 'Lily Thompson', points: 1890, joinDate: '2025-02-20' },
  { id: 19, name: 'Ben Kowalski', points: 1670, joinDate: '2025-03-05' },
  { id: 20, name: 'Zara Mitchell', points: 1540, joinDate: '2025-01-30' },
  { id: 21, name: 'Dylan Park', points: 1320, joinDate: '2025-04-12' },
  { id: 22, name: 'Hannah Nguyen', points: 1180, joinDate: '2025-03-18' },
  { id: 23, name: 'Alex Rivera', points: 1050, joinDate: '2025-04-01' },
  { id: 24, name: 'Jordan Bell', points: 980, joinDate: '2025-05-10' },
  { id: 25, name: 'Sam Whitaker', points: 870, joinDate: '2025-04-25' },
  { id: 26, name: 'Mia Foster', points: 720, joinDate: '2025-06-02' },
  { id: 27, name: 'Ethan Clark', points: 590, joinDate: '2025-05-20' },
  { id: 28, name: 'Nina Volkov', points: 480, joinDate: '2025-07-15' },
  { id: 29, name: 'Leo Tanaka', points: 350, joinDate: '2025-06-28' },
  { id: 30, name: 'Grace Kim', points: 280, joinDate: '2025-08-10' },
  { id: 31, name: 'Carlos Diaz', points: 220, joinDate: '2025-09-05' },
  { id: 32, name: 'Becca Young', points: 170, joinDate: '2025-10-01' },
  { id: 33, name: 'Isaiah Perry', points: 120, joinDate: '2025-11-12' },
  { id: 34, name: 'Devon Kline', points: 80, joinDate: '2025-12-03' },
  { id: 35, name: 'Taylor Adams', points: 50, joinDate: '2026-01-20' },
];

export const activities: Activity[] = [
  { id: 100, memberId: 12, type: 'attendance', points: 10, description: 'Checked in at the gym', date: '2026-03-12' },
  { id: 99, memberId: 12, type: 'class', points: 200, description: 'Lead Climbing 101', date: '2026-03-10' },
  { id: 98, memberId: 12, type: 'share_link', points: 50, description: 'Shared referral link', date: '2026-03-08' },
  { id: 97, memberId: 12, type: 'attendance', points: 10, description: 'Checked in at the gym', date: '2026-03-05' },
  { id: 96, memberId: 12, type: 'follow_ig', points: 500, description: 'Followed @weareclimbmax', date: '2026-03-03' },
  { id: 95, memberId: 12, type: 'membership', points: 100, description: 'March membership', date: '2026-03-01' },
  { id: 94, memberId: 12, type: 'attendance', points: 10, description: 'Checked in at the gym', date: '2026-02-27' },
  { id: 93, memberId: 12, type: 'event_attendance', points: 50, description: 'Friday Night Sends', date: '2026-02-25' },
  { id: 92, memberId: 12, type: 'class', points: 200, description: 'Bouldering Fundamentals', date: '2026-02-22' },
  { id: 91, memberId: 12, type: 'attendance', points: 10, description: 'Checked in at the gym', date: '2026-02-20' },
  { id: 90, memberId: 12, type: 'purchase', points: 45, description: 'Pro shop purchase ($45)', date: '2026-02-18' },
  { id: 89, memberId: 12, type: 'follow_fb', points: 200, description: 'Followed on Facebook', date: '2026-02-15' },
  { id: 88, memberId: 12, type: 'pre_registration', points: 50, description: 'Spring Comp pre-reg', date: '2026-02-12' },
  { id: 87, memberId: 12, type: 'attendance', points: 10, description: 'Checked in at the gym', date: '2026-02-10' },
  { id: 86, memberId: 12, type: 'membership', points: 100, description: 'February membership', date: '2026-02-01' },
  { id: 85, memberId: 12, type: 'competition', points: 100, description: 'Winter Bouldering Comp', date: '2026-01-28' },
  { id: 84, memberId: 12, type: 'attendance', points: 10, description: 'Checked in at the gym', date: '2026-01-25' },
  { id: 83, memberId: 12, type: 'share_link', points: 50, description: 'Shared referral link', date: '2026-01-20' },

  { id: 200, memberId: 1, type: 'volunteer', points: 1000, description: 'Route setting volunteer', date: '2026-03-11' },
  { id: 201, memberId: 1, type: 'class', points: 200, description: 'Advanced Lead Technique', date: '2026-03-09' },
  { id: 202, memberId: 1, type: 'attendance', points: 10, description: 'Checked in at the gym', date: '2026-03-12' },
  { id: 203, memberId: 2, type: 'merch_video', points: 200, description: 'Shared climbing video in CMAX gear', date: '2026-03-10' },
  { id: 204, memberId: 2, type: 'competition', points: 100, description: 'Winter Bouldering Comp', date: '2026-03-08' },
  { id: 205, memberId: 3, type: 'charity', points: 200, description: 'Access Fund donation', date: '2026-03-07' },
  { id: 206, memberId: 4, type: 'class', points: 200, description: 'Intro to Crack Climbing', date: '2026-03-06' },
  { id: 207, memberId: 5, type: 'attendance', points: 10, description: 'Checked in at the gym', date: '2026-03-12' },
  { id: 208, memberId: 6, type: 'share_link', points: 50, description: 'Shared referral link', date: '2026-03-11' },
  { id: 209, memberId: 7, type: 'membership', points: 100, description: 'March membership', date: '2026-03-01' },
];
