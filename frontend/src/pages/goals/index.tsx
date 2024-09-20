import React, { useEffect, useState } from 'react';
import { Container, Title, Text, Button, Group, Stack, Card, RingProgress } from '@mantine/core';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/layout';
import { Goal } from '@/constants/Goal';
import { getAllGoals } from '@/utils/api';




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
              <Card key={goal.id} shadow="sm" p="lg">
                <Group justify='space-between'>
                <Stack>
                    <Title order={2}>{goal.title}</Title>
                    <Text><em>{goal.description}</em></Text>
                    <Text>Created by: {goal.creatorName}</Text>
                </Stack>
                <RingProgress
                  sections={[{ value: goal.finishedDays / goal.totalDays * 100, color: 'blue' }]}
                  label={<Text size="sm" c="blue" ta="center">
                    {Math.round(goal.finishedDays / goal.totalDays * 100)}%
                    </Text>}
                  />
                </Group>
                <Button variant="light" color="blue" fullWidth mt="md" radius="md">
                  View Details
                </Button>
              </Card>
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