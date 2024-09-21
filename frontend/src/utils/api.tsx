import axios from 'axios';
import { Goal } from '@/types/goal';
import { getAuthToken } from '@dynamic-labs/sdk-react-core';

const mockGoals: Record<string, Goal> = {
  '1': {
    id: '1',
    name: 'Daily Exercise Challenge',
    description: 'Exercise regularly to improve fitness and health.',
    amountStaked: 0.5,
    participantsCnt: 3,
    participants: ['0x1234567890123456789012345678901234567890', '0xEa1fa292277651251238FdDe68b4a67cF0327120', '0x1111111111111111111111111111111111111111'],
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
    participantsCnt: 2,
    participants: ['0x1234567890123456789012345678901234567890', '0x0987654321098765432109876543210987654321'],
    startDate: '2023-09-01',
    endDate: '2023-10-01',
    currentDay: 0,
    totalDays: 30,
    status: 'Not Started',
    creator: '0x0987654321098765432109876543210987654321',
    creatorName: 'Jane Doe',
    submissions: [],
  },
  '3': {
    id: '3',
    name: 'Eat More',
    description: 'Eat more healthy foods to improve your health.',
    amountStaked: 0.3,
    participantsCnt: 2,
    participants: ['0x1234567890123456789012345678901234567890', '0xEa1fa292277651251238FdDe68b4a67cF0327120'],
    startDate: '2023-09-01',
    endDate: '2023-10-01',
    currentDay: 3,
    totalDays: 30,
    status: 'In Progress',
    creator: '0x0987654321098765432109876543210987654321',
    creatorName: 'Jane Doe', 
    submissions: [
      { id: '1', day: 3, person: 'person 2', status: 'pending submission' },
      { id: '2', day: 3, person: 'person 1', status: 'pending verification', photoUrl: 'https://example.com/photo3.jpg' },
      { id: '3', day: 2, person: 'person 1', status: 'completed', photoUrl: 'https://example.com/photo1.jpg' },
      { id: '4', day: 2, person: 'person 2', status: 'missing' },
      { id: '6', day: 1, person: 'person 1', status: 'completed', photoUrl: 'https://example.com/photo4.jpg' },
      { id: '7', day: 1, person: 'person 2', status: 'completed', photoUrl: 'https://example.com/photo5.jpg' },
    ],
  },
};

const mockUserGoals: Goal[] = [mockGoals['1'], mockGoals['2']];

const USE_MOCK_DATA = true;
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000";
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`
};

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

export async function getUserGoals(account: string): Promise<Goal[]> {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockUserGoals);
      }, 500);
    });
  } else {
    try {
      const response = await axios.get(`${API_BASE_URL}/goals/user/${account ?? "1"}`, {
        headers: headers
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user goals:', error);
      throw error;
    }
  }
}

export async function updateGoal(id: string, updateData: Partial<Goal>) {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const goal = mockGoals[id];
        if (goal) {
          const updatedGoal = { ...goal, ...updateData };
          mockGoals[id] = updatedGoal;
          resolve(updatedGoal);
        }
      }, 500);
    });
  } else {
    try {
      const response = await axios.post(`${API_BASE_URL}/goals/${id}`, updateData, {
        headers: headers
      });
      return response.data;
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  }
}

export async function uploadPhoto(goalId: string, file: File): Promise<string> {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const photoUrl = `https://example.com/photos/${Date.now()}.jpg`;
        resolve(photoUrl);
      }, 500);
    });
  } else {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const response = await axios.post(`${API_BASE_URL}/goals/${goalId}/upload-photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${getAuthToken()}` }
      });
      return response.data.photoUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  }
}