import React, { useEffect, useState } from 'react';
import { Button, Container, Group, Stack, Title } from '@mantine/core';
import { useRouter } from 'next/router';
import GoalCard from '@/components/goals/GoalCard';
import Layout from '@/components/layout/layout';
import { Goal } from '@/types/goal';
import { getAllGoals } from '@/utils/api';

const FindGoals: React.FC = () => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const router = useRouter();

    useEffect(() => {
        // Fetch goals from the API
        getAllGoals().then(data => setGoals(data));
    }, []);

    return (
        <Layout>
        <Container size="lg">
          <Stack gap="xl" mt={50}>
            <Group justify="space-between">
              <Title order={1}>Find Goals</Title>
              <Button onClick={() => router.push('/goals/create')}>Create Public Goal</Button>
            </Group>
            <Stack gap="md">
              {goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </Stack>
          </Stack>
        </Container>
      </Layout>
    );
};

export default FindGoals;