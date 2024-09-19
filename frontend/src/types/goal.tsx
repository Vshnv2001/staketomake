export interface Submission {
  day: number;
  person: string;
  status: 'completed' | 'pending submission' | 'pending verification' | 'missing' | 'rejected';
  photoUrl?: string;
}

export interface GoalData {
  id: string;
  name: string;
  amountStaked: number;
  participants: number;
  startDate: string;
  endDate: string;
  currentDay: number;
  totalDays: number;
  submissions: Submission[];
}