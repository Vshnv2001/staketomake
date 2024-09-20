import axios from 'axios';
import { Goal } from '@/constants/Goal';

const mockGoals: Record<string, Goal> = {
  '1': {
    id: '1',
    title: 'Lose 10 pounds',
    description: 'Exercise regularly and maintain a healthy diet to lose 10 pounds.',
    status: 'In Progress',
    finishedDays: 10,
    totalDays: 31,
    targetDate: new Date('2023-12-31').getTime() / 1000,
    creator: '0x1234567890123456789012345678901234567890',
    creatorName: 'John Doe',
  },
  '2': {
    id: '2',
    title: 'Learn React',
    description: 'Complete a React course and build a project using React.',
    status: 'Not Started',
    finishedDays: 0,
    totalDays: 10,
    targetDate: new Date('2023-10-01').getTime() / 1000,
    creator: '0x0987654321098765432109876543210987654321',
    creatorName: 'Jane Doe',
  },
};

const mockPublicGoals: Goal[] = [
  {
    id: '1',
    title: 'Lose 10 pounds',
    description: 'Exercise regularly and maintain a healthy diet to lose 10 pounds.',
    status: 'In Progress',
    finishedDays: 10,
    totalDays: 31,
    targetDate: new Date('2023-12-31').getTime() / 1000,
    creator: '0x1234567890123456789012345678901234567890',
    creatorName: 'John Doe',
  },
  {
    id: '2',
    title: 'Learn React',
    description: 'Complete a React course and build a project using React.',
    status: 'Not Started',
    finishedDays: 0,
    totalDays: 10,
    targetDate: new Date('2023-10-01').getTime() / 1000,
    creator: '0x0987654321098765432109876543210987654321',
    creatorName: 'Jane Doe',
  },
];

const USE_MOCK_DATA = true;
const API_BASE_URL = 'http://localhost:8000';

export async function getGoalDetails(id: string) {
  if (USE_MOCK_DATA) {
    // Using mock data
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const goal = mockGoals[id as keyof typeof mockGoals];
        if (goal) {
          resolve(goal);
        } else {
          reject(new Error('Goal not found'));
        }
      }, 500); // fake network delays
    });
  } else {
    try {
      const response = await axios.get(`${API_BASE_URL}/goals/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching goal details:', error);
      throw error;
    }
  }
}

export async function getAllGoals() {
  if (USE_MOCK_DATA) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(mockPublicGoals);
      }, 500);
    });
  } else {
    try {
      const response = await axios.get(`${API_BASE_URL}/goals/all`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all goals:', error);
      throw error;
    }
  }
}

export async function getUserGoals(id: string) {
  if (USE_MOCK_DATA) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(mockPublicGoals);
      }, 500);
    });
  } else {
    try {
      const response = await axios.get(`${API_BASE_URL}/goals/user`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user goals:', error);
      throw error;
    }
  }
};