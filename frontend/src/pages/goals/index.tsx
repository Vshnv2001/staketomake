import React, { useEffect, useState } from 'react';
import { Container, Title, Text, Button, Group, Stack, Loader } from '@mantine/core';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/layout';
import { Goal } from '@/types/goal';
import { getAllGoals, getUserGoals } from '@/utils/api';
import GoalCard from '@/components/goals/GoalCard';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

const Goals: React.FC = () => {
  const router = useRouter();
  const [userGoals, setUserGoals] = useState<Goal[]>([]);
  const [recommendedGoals, setRecommendedGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  
  const { user } = useDynamicContext();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setIsLoading(true);
        const [userGoalsData, allGoalsData] = await Promise.all([
          getUserGoals(user?.userId ?? ""),
          getAllGoals()
        ]);
        setUserGoals(userGoalsData);
        // Filter out user's goals from all goals to get recommended goals
        const recommendedGoalsData = allGoalsData.filter(
          goal => !userGoalsData.some(userGoal => userGoal.id === goal.id)
        );
        setRecommendedGoals(recommendedGoalsData);
      } catch (err) {
        setError('Failed to fetch goals. Please try again later.');
        console.error('Error fetching goals:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, [user?.userId]);

  if (isLoading) {
    return (
      <Layout>
        <Container size="lg">
          <Loader size="xl" />
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container size="lg">
          <Text color="red">{error}</Text>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container size="lg">
        <Stack gap="xl" mt={50}>
          <Group justify="space-between">
            <Title order={1}>Your Goals</Title>
            <Button onClick={() => router.push('/goals/create')}>Create New Goal</Button>
          </Group>
          <Stack gap="md">
            {userGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </Stack>
          <Title order={2} mt={40}>Recommended Goals</Title>
          <Text>Here are some goals that we think you might like:</Text>
          <Stack gap="md">
            {recommendedGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </Stack>
        </Stack>
      </Container>
    </Layout>
  );
};

export default Goals;