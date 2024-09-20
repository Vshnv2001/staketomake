import React, { useEffect, useState } from 'react';
import { getAllGoals, getGoalDetails } from '@/utils/api';
import Layout from '@/components/layout/layout';
import { Stack, Group, Title, Button, Card, Text, Container } from '@mantine/core';
import router from 'next/router';
import { Goal } from '@/constants/Goal';
import GoalCard from '@/components/GoalCard';



const About = () => {
    const [goals, setGoals] = useState<Goal[]>([]);

    useEffect(() => {
        // Fetch goals from the API
        getAllGoals().then(data => setGoals(data));
    }, []);
    return (
        <Layout>
        <Container size="lg">
          <Stack gap="xl" mt={50}>
            <Group justify='space-between'>
              <Title order={1}>About StakeToMake</Title>
            </Group>
            <Text>StakeToMake is a platform that allows you to create and find goals that you can stake on.</Text>
            <Text>You can create a goal and stake on it, or find a goal and stake on it.</Text>
            <Text>You can also create a goal and find a goal.</Text>
          </Stack>
        </Container>
      </Layout>
    );
};

export default About;
