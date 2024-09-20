import axios from 'axios';
import { Goal } from '@/types/goal';

const mockGoals: Record<string, Goal> = {
  '1': {
    id: '1',
    name: 'Daily Exercise Challenge',
    description: 'Exercise regularly to improve fitness and health.',
    amountStaked: 0.5,
    participants: 3,
    startDate: '2024-09-01',
    endDate: '2024-09-03',
    currentDay: 3,
    totalDays: 3,
    status: 'In Progress',
    creator: '0x1234567890123456789012345678901234567890',
    creatorName: 'John Doe',
    submissions: [
      { id: '1', day: 3, person: 'person 2', status: 'pending submission' },
      { id: '2', day: 3, person: 'person 3', status: 'pending verification', photoUrl: 'https://example.com/photo3.jpg' },
      { id: '3', day: 2, person: 'person 1', status: 'completed', photoUrl: 'https://example.com/photo1.jpg' },
      { id: '4', day: 2, person: 'person 2', status: 'missing' },
      { id: '5', day: 2, person: 'person 3', status: 'rejected', photoUrl: 'https://example.com/photo2.jpg' },
      { id: '6', day: 1, person: 'person 1', status: 'completed', photoUrl: 'https://example.com/photo4.jpg' },
      { id: '7', day: 1, person: 'person 2', status: 'completed', photoUrl: 'https://example.com/photo5.jpg' },
      { id: '8', day: 1, person: 'person 3', status: 'completed', photoUrl: 'https://example.com/photo6.jpg' },
    ],
  },
  '2': {
    id: '2',
    name: 'Learn React',
    description: 'Complete a React course and build a project using React.',
    amountStaked: 0.3,
    participants: 2,
    startDate: '2023-09-01',
    endDate: '2023-10-01',
    currentDay: 0,
    totalDays: 30,
    status: 'Not Started',
    creator: '0x0987654321098765432109876543210987654321',
    creatorName: 'Jane Doe',
    submissions: [],
  },
};

const mockUserGoals: Goal[] = [mockGoals['1'], mockGoals['2']];

const USE_MOCK_DATA = true;
const API_BASE_URL = 'http://localhost:8000';

export async function getGoalDetails(id: string): Promise<Goal> {
  if (USE_MOCK_DATA) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const goal = mockGoals[id];
        if (goal) {
          resolve(goal);
        } else {
          reject(new Error('Goal not found'));
        }
      }, 500);
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

export async function getAllGoals(): Promise<Goal[]> {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Object.values(mockGoals));
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

export async function getUserGoals(): Promise<Goal[]> {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockUserGoals);
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
}