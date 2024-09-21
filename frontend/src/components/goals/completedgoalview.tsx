import React from 'react';
import { Card, Title, Group, Text, Stack, ThemeIcon } from '@mantine/core';
import { IconCalendar, IconUsers, IconCoin } from '@tabler/icons-react';
import { Goal, Submission } from '../../types/goal';
import SubmissionHistory from './submissionhistory';

interface CompletedGoalViewProps {
  goalData: Goal;
  onViewPhoto: (submission: Submission) => void;
}

export default function CompletedGoalView({ goalData, onViewPhoto }: CompletedGoalViewProps) {
  const successRate = (goalData.submissions.filter(s => s.status === 'completed').length / goalData.submissions.length) * 100;

  return (
    <Card withBorder shadow="sm" p="xl" radius="md">
      <Stack gap="xl">
        <Title order={2}>{goalData.name} - Completed</Title>
        <Text size="lg">{goalData.description}</Text>

        <Group justify="space-between">
          <Group gap="xs">
            <ThemeIcon color="blue" size="lg" variant="light">
              <IconCoin size={20} />
            </ThemeIcon>
            <Text fw={500}>{goalData.amountStaked} ETH staked</Text>
          </Group>
          <Group gap="xs">
            <ThemeIcon color="green" size="lg" variant="light">
              <IconUsers size={20} />
            </ThemeIcon>
            <Text fw={500}>{goalData.participantsCnt} participants</Text>
          </Group>
          <Group gap="xs">
            <ThemeIcon color="orange" size="lg" variant="light">
              <IconCalendar size={20} />
            </ThemeIcon>
            <Text fw={500}>{goalData.startDate} - {goalData.endDate}</Text>
          </Group>
        </Group>

        <Card withBorder p="md">
          <Stack gap="md">
            <Title order={3}>Goal Summary</Title>
            <Text fw={500}>Success Rate: {successRate.toFixed(2)}%</Text>
            <Text>Total Days: {goalData.totalDays}</Text>
            <Text>Completed Submissions: {goalData.submissions.filter(s => s.status === 'completed').length}</Text>
          </Stack>
        </Card>

        <SubmissionHistory submissions={goalData.submissions} onViewPhoto={onViewPhoto} />
      </Stack>
    </Card>
  );
}