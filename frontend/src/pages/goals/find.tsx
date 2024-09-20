import React, { useEffect, useState } from 'react';
import { getAllGoals, getGoalDetails } from '@/utils/api';
import Layout from '@/components/layout/layout';
import { Stack, Group, Title, Button, Card, Text, Container } from '@mantine/core';
import router from 'next/router';
import { Goal } from '@/constants/Goal';



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
                <Card key={goal.id} shadow="sm" p="lg">
                  <Group>
                    <Stack>
                    <Title order={2}>{goal.title}</Title>
                    <Text><em>{goal.description}</em></Text>
                    <Text>Created by: {goal.creatorName}</Text>
                    </Stack>
                  </Group>
                  <Button variant="light" fullWidth mt="md" radius="md">
                    View Details
                  </Button>
                </Card>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Layout>
    );
};

export default FindGoals;
