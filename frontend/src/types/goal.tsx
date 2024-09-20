export type SubmissionStatus = 'completed' | 'pending submission' | 'pending verification' | 'missing' | 'rejected';

export interface Submission {
  id: string;
  day: number;
  person: string;
  status: SubmissionStatus;
  photoUrl?: string;
}

export interface Goal {
  id: string;
  name: string;
  description: string;
  amountStaked: number;
  participants: number;
  startDate: string;
  endDate: string;
  currentDay: number;
  totalDays: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  creator: string;
  creatorName: string;
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
