import React from 'react';
import { Card, Title, Group, Text, Progress, Stack } from '@mantine/core';
import { IconCalendar, IconUsers, IconCoin } from '@tabler/icons-react';
import { Goal } from '../../types/goal';

interface GoalHeaderProps {
  goalData: Goal;
}

export default function GoalHeader({ goalData }: GoalHeaderProps) {
  const progressVal = (goalData.currentDay / goalData.totalDays) * 100

  return (
    <Card withBorder shadow="sm" p="md">
      <Stack gap="md">
        <Title order={2}>{goalData.name}</Title>
        <Group justify='space-between'>
          <Group gap="xs">
            <IconCoin size={20} />
            <Text>{goalData.amountStaked} ETH staked</Text>
          </Group>
          <Group gap="xs">
            <IconUsers size={20} />
            <Text>{goalData.participantsCnt} participants</Text>
          </Group>
          <Group gap="xs">
            <IconCalendar size={20} />
            <Text>{goalData.startDate} - {goalData.endDate}</Text>
          </Group>
        </Group>
        <Progress.Root size={40} 
        >
          <Progress.Section value={progressVal != 0 ? progressVal : 100}>
            <Progress.Label>
              {`Day ${goalData.currentDay}/${goalData.totalDays}`}
              </Progress.Label>
          </Progress.Section>
        </Progress.Root>
      </Stack>
    </Card>
  );
}