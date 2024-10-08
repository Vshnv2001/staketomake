import React, { useEffect, useState } from 'react';
import { Button, Container, Group, Stack, Title, TextInput, Card, Text, Badge, Grid, Loader, Center } from '@mantine/core';
import { useRouter } from 'next/router';
import { IconSearch } from '@tabler/icons-react';
import Fuse from 'fuse.js';
import { Goal } from '@/types/goal';
import { getAllGoals } from '@/utils/api';
import Layout from '@/components/layout/layout';

const FindGoals: React.FC = () => {
  const [allGoals, setAllGoals] = useState<Goal[]>([]);
  const [filteredGoals, setFilteredGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    getAllGoals().then(data => {
      setAllGoals(data);
      setFilteredGoals(data);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setIsSearching(true);
      const fuse = new Fuse(allGoals, {
        keys: ['name', 'description'],
        threshold: 0.4,
      });
      const result = fuse.search(searchTerm);
      setFilteredGoals(result.map(item => item.item));
      setIsSearching(false);
    } else {
      setFilteredGoals(allGoals);
    }
  }, [searchTerm, allGoals]);

  const handleGoalClick = (goalId: string) => {
    router.push(`/goals/${goalId}`);
  };

  return (
    <Layout>
      <Container size="lg">
        <Stack gap="xl" mt={50}>
          <Group justify="space-between">
            <Title order={1}>Join Health Goals</Title>
            <Button onClick={() => router.push('/goals/create')}>Create Health Goal</Button>
          </Group>
          <TextInput
            placeholder="Search goals..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.currentTarget.value)}
            leftSection={<IconSearch size="1.1rem" stroke={1.5} />}
            rightSection={isSearching && <Loader size="sm" />}
          />
          {isLoading ? (
            <Center style={{ height: 200 }}>
              <Loader size="xl" />
            </Center>
          ) : (
            <Grid>
              {filteredGoals.map((goal) => (
                <Grid.Col key={goal.id} span={4}>
                  <Card
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    withBorder
                    onClick={() => handleGoalClick(goal.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Stack>
                      <Title order={3}>{goal.name}</Title>
                      <Text lineClamp={2}>{goal.description}</Text>
                      <Group justify="space-between">
                        <Badge color="blue">{goal.participantsCnt} participants</Badge>
                        <Text size="sm">{goal.amountStaked} ETH staked</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm">Starts: {new Date(goal.startDate).toLocaleDateString()}</Text>
                        <Text size="sm">Ends: {new Date(goal.endDate).toLocaleDateString()}</Text>
                      </Group>
                    </Stack>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          )}
        </Stack>
      </Container>
    </Layout>
  );
};

export default FindGoals;