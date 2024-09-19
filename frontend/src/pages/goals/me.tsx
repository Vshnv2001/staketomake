import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Title, Text, Card, Group, Stack, Button, Progress, Badge } from '@mantine/core';
import { IconCalendar, IconUsers, IconCoin } from '@tabler/icons-react';
import { useWeb3 } from '../../contexts/web3context';
import Layout from '../../components/layout/layout';

interface Submission {
  day: number;
  person: string;
  status: 'completed' | 'pending submission' | 'pending verification' | 'missing' | 'rejected';
}

interface Photo {
  id: string;
  submissionTime: string;
  verifiedBy: string;
}

interface GoalData {
  id: string;
  name: string;
  amountStaked: number;
  participants: number;
  startDate: string;
  endDate: string;
  currentDay: number;
  totalDays: number;
  submissions: Submission[];
  photos: Photo[];
}

const mockGoalData: GoalData = {
  id: '1',
  name: 'Daily Exercise Challenge',
  amountStaked: 0.5,
  participants: 3,
  startDate: '2024-09-01',
  endDate: '2024-09-03',
  currentDay: 3,
  totalDays: 3,
  submissions: [
    { day: 3, person: 'person 2', status: 'pending submission' },
    { day: 3, person: 'person 3', status: 'pending verification' },
    { day: 2, person: 'person 1', status: 'completed' },
    { day: 2, person: 'person 2', status: 'missing' },
    { day: 2, person: 'person 3', status: 'rejected' },
    { day: 1, person: 'person 1', status: 'completed' },
    { day: 1, person: 'person 2', status: 'completed' },
    { day: 1, person: 'person 3', status: 'completed' },
  ],
  photos: [
    { id: '1', submissionTime: '2024-09-01 09:00', verifiedBy: 'XXXXXX' },
    { id: '2', submissionTime: '2024-09-01 18:00', verifiedBy: 'XXXXXX' },
  ],
};

const statusColors = {
  completed: 'green',
  'pending submission': 'yellow',
  'pending verification': 'orange',
  missing: 'red',
  rejected: 'red',
};

export default function GoalDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { account } = useWeb3();
  const [goalData, setGoalData] = useState<GoalData | null>(null);

  useEffect(() => {
    // In a real application, you would fetch the goal data based on the ID
    // For now, we'll use the mock data
    setGoalData(mockGoalData);
  }, [id]);

  if (!goalData) {
    return <Layout><Container>Loading...</Container></Layout>;
  }

  const canSubmit = account && goalData.submissions.some(s => s.person === account && s.status === 'pending submission');

  return (
    <Layout>
      <Container size="md">
        <Stack >
          <Title order={1}>{goalData.name}</Title>
          
          <Card withBorder shadow="sm">
            <Group >
              <Group>
                <IconCoin size={24} />
                <Text>Amount Staked: {goalData.amountStaked} ETH</Text>
              </Group>
              <Group>
                <IconUsers size={24} />
                <Text>Participants: {goalData.participants}</Text>
              </Group>
              <Group>
                <IconCalendar size={24} />
                <Text>{goalData.startDate} - {goalData.endDate}</Text>
              </Group>
            </Group>
          </Card>
          
          <Card withBorder shadow="sm">
            <Stack>
              <Group>
                <Text >Submission Activity</Text>
                <Text>Day {goalData.currentDay}/{goalData.totalDays}</Text>
              </Group>
              <Progress value={(goalData.currentDay / goalData.totalDays) * 100} size="xl" />
              {canSubmit && (
                <Button color="yellow" fullWidth>Please Submit Log</Button>
              )}
              {goalData.submissions.map((submission, index) => (
                <Group key={index}>
                  <Text>{submission.person}</Text>
                  <Badge color={statusColors[submission.status]}>{submission.status}</Badge>
                </Group>
              ))}
            </Stack>
          </Card>
          
          {goalData.photos.length > 0 && (
            <Card withBorder shadow="sm">
              <Stack>
                <Text>Photo Submissions</Text>
                {goalData.photos.map((photo) => (
                  <Group key={photo.id} >
                    <Text>Photo {photo.id}</Text>
                    <Text size="sm" color="dimmed">
                      Submitted: {photo.submissionTime}, Verified by: {photo.verifiedBy}
                    </Text>
                  </Group>
                ))}
              </Stack>
            </Card>
          )}
        </Stack>
      </Container>
    </Layout>
  );
}