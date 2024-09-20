export interface Goal {
    id: string;
    title: string;
    description: string;
    status: string;
    finishedDays: number;
    totalDays: number;
    targetDate: number;
    creator: string;
    creatorName: string;
}