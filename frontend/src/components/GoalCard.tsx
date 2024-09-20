import React from 'react';
import { Card, Group, Stack, Title, Text, Button, RingProgress } from '@mantine/core';
import { Goal } from '@/constants/Goal';

interface GoalCardProps {
  goal: Goal;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
  return (
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
  );
};

export default GoalCard;
