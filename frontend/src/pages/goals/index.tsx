import React, { useEffect, useState } from 'react';
import { Container, Title, Text, Button, Group, Stack } from '@mantine/core';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/layout';
import { Goal } from '@/constants/Goal';
import { getAllGoals } from '@/utils/api';
import GoalCard from '@/components/GoalCard';

const Goals: React.FC = () => {
  const router = useRouter();
  const [activeGoals, setActiveGoals] = useState<Goal[]>([]);

  useEffect(() => {
    // Fetch active goals from the API
    getAllGoals().then(data => setActiveGoals(data));
  }, []);

  return (
    <Layout>
      <Container size="lg">
        <Stack gap="xl" mt={50}>
          <Group justify='space-between'>
            <Title order={1}>Your Goals</Title>
            <Button onClick={() => router.push('/goals/create')}>Create New Goal</Button>
          </Group>
          <Stack gap="md">
            {activeGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal}/>
            ))}
          </Stack>
          <Title order={2} mt={40}>Recommended Goals</Title>
          <Text>Here are some goals that we think you might like:</Text>
          
        </Stack>
      </Container>
    </Layout>
  );
};

export default Goals;