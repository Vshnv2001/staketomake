export interface Submission {
  id: string;
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

export interface GoalFormValues {
  title: string;
  description: string;
  stakingAmount: number;
  startDate: Date;
  endDate: Date;
  verificationMethod: string;
  isPublic: boolean;
}
