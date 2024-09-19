import React from 'react';
import { Container, Title, Text, Button, Group, Stack, Card } from '@mantine/core';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/layout';

interface Goal {
  id: number;
  name: string;
  progress: string;
}

// Mock data for active goals
const activeGoals: Goal[] = [
  { id: 1, name: 'Run 5km', progress: '10/31' },
  { id: 2, name: 'Read 10 books', progress: '3/10' },
];

const Goals: React.FC = () => {
  const router = useRouter();

  return (
    <Layout>
      <Container size="lg">
        <Stack gap="xl" mt={50}>
          <Group>
            <Title order={1}>Your Goals</Title>
            <Button onClick={() => router.push('/goals/create')}>Create New Goal</Button>
          </Group>
          <Stack gap="md">
            {activeGoals.map((goal) => (
              <Card key={goal.id} shadow="sm" p="lg">
                <Group>
                  <Text>{goal.name}</Text>
                  <Text color="dimmed">Progress: {goal.progress}</Text>
                </Group>
                <Button variant="light" color="blue" fullWidth mt="md" radius="md">
                  View Details
                </Button>
              </Card>
            ))}
          </Stack>
          <Title order={2} mt={40}>Find Goals</Title>
          <Text>Explore community goals and challenges to join:</Text>
          {/* Add a list or grid of community goals here */}
        </Stack>
      </Container>
    </Layout>
  );
};

export default Goals;