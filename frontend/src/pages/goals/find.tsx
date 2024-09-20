import GoalCard from '@/components/goals/GoalCard';
import Layout from '@/components/layout/layout';
import { Goal } from '@/constants/Goal';
import { getAllGoals } from '@/utils/api';
import { Button, Container, Group, Stack, Title } from '@mantine/core';
import router from 'next/router';
import { useEffect, useState } from 'react';



const FindGoals = () => {
    const [goals, setGoals] = useState<Goal[]>([]);

    useEffect(() => {
        // Fetch goals from the API
        getAllGoals().then(data => setGoals(data));
    }, []);
    console.log(goals);
    return (
        <Layout>
        <Container size="lg">
          <Stack gap="xl" mt={50}>
            <Group justify='space-between'>
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
