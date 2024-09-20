import React, { useEffect, useState } from 'react';
import { Container, Title, Text, Button, Group, Stack, Loader } from '@mantine/core';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/layout';
import { Goal } from '@/constants/Goal';
import { getAllGoals, getUserGoals } from '@/utils/api';
import GoalCard from '@/components/goals/GoalCard';
import { useWeb3 } from '../../contexts/web3context';


const Goals: React.FC = () => {
  const router = useRouter();
  const [userGoals, setUserGoals] = useState<Goal[]>([]);
  const [recommendedGoals, setRecommendedGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { account } = useWeb3();



  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setIsLoading(true);
        const [userGoalsData, allGoalsData] = await Promise.all<Goal[]>([
          getUserGoals(account ?? ""),
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
  }, [account]);

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
          <Group justify='space-between'>
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