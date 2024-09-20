import React from 'react';
import { Card, Group, Stack, Title, Text, Button, RingProgress } from '@mantine/core';
import { useRouter } from 'next/router';
import { Goal } from '../../types/goal';

interface GoalCardProps {
  goal: Goal;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/goals/${goal.id}`);
  };

  return (
    <Card 
      key={goal.id} 
      shadow="sm" 
      p="lg" 
      onClick={handleClick} 
      style={{ cursor: 'pointer' }}
    >
      <Group justify='space-between'>
        <Stack>
          <Title order={2}>{goal.name}</Title>
          <Text><em>{goal.description}</em></Text>
          <Text>Created by: {goal.creatorName}</Text>
        </Stack>
        <RingProgress
          sections={[{ value: goal.currentDay / goal.totalDays * 100, color: 'blue' }]}
          label={<Text size="sm" c="blue" ta="center">
            {Math.round(goal.currentDay / goal.totalDays * 100)}%
          </Text>}
        />
      </Group>
      <Button 
        variant="light" 
        color="blue" 
        fullWidth 
        mt="md" 
        radius="md"
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
      >
        View Details
      </Button>
    </Card>
  );
};

export default GoalCard;