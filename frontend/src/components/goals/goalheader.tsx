import React from 'react';
import { Card, Title, Group, Text, Progress, Stack, ThemeIcon, useMantineTheme, Button, Box } from '@mantine/core';
import { IconCalendar, IconUsers, IconCoin } from '@tabler/icons-react';
import { Goal } from '../../types/goal';

interface GoalHeaderProps {
  goalData: Goal;
  isParticipant: boolean;
  canJoin: boolean;
  onJoin: () => void;
  onLeave: () => void;
  isLoading: boolean;
}

export default function GoalHeader({ goalData, isParticipant, canJoin, onJoin, onLeave, isLoading }: GoalHeaderProps) {
  const theme = useMantineTheme();
  const progressVal = (goalData.currentDay / goalData.totalDays) * 100;

  return (
    <Card withBorder shadow="sm" p="xl" radius="md" style={{ position: 'relative' }}>
      <Box style={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
        {canJoin && (
          <Button 
            size="sm" 
            onClick={onJoin}
            loading={isLoading}
          >
            Join
          </Button>
        )}
        {isParticipant && goalData.status === 'Not Started' && (
          <Button 
            size="sm"
            color="red" 
            variant="outline"
            onClick={onLeave}
            loading={isLoading}
          >
            Leave
          </Button>
        )}
      </Box>
      <Stack gap="md">
        <Title order={2}>{goalData.name}</Title>
        <Text size="sm" c="dimmed">{goalData.description}</Text>
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
        <Stack gap="xs">
          <Text fw={500}>Progress</Text>
          <Progress 
            value={progressVal} 
            size="xl" 
            radius="xl"
            color={theme.primaryColor}
          />
          <Text ta="center" fz="sm" fw={500}>
            Day {goalData.currentDay} of {goalData.totalDays}
          </Text>
        </Stack>
      </Stack>
    </Card>
  );
}