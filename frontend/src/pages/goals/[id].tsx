import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Title, Text, Paper, Group, Button, LoadingOverlay } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useWeb3 } from '../../contexts/web3context';

// Assuming you have a function to fetch goal details from your smart contract
import { Goal, getGoalDetails } from '../../utils/api';

export default function GoalDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [goal, setGoal] = useState<Goal>();
  const [loading, setLoading] = useState(true);
  const { account } = useWeb3();

  useEffect(() => {
    async function fetchGoalDetails() {
      if (id) {
        try {
          const goalData = await getGoalDetails(id as string);
          setGoal(goalData);
        } catch (error) {
          console.error('Error fetching goal details:', error);
          // Handle error (e.g., show error message)
        } finally {
          setLoading(false);
        }
      }
    }

    fetchGoalDetails();
  }, [id]);

  const handleEdit = () => {
    router.push(`/goals/edit/${id}`);
  };

  const handleDelete = async () => {
    // Implement delete functionality
    // This would typically involve calling a smart contract method
    console.log('Delete goal:', id);
  };

  if (loading) {
    return <LoadingOverlay visible={true} />;
  }

  if (!goal) {
    return <Container>
      <Text>Goal not found</Text>
    </Container>;
  }

  return (
    <Container size="sm">
      <Paper shadow="xs" p="md" withBorder>
        <Title order={2}>{goal.title}</Title>
        <Text mt="md">{goal.description}</Text>
        <Text mt="sm">Status: {goal.status}</Text>
        <Text>Target Date: {new Date(goal.targetDate * 1000).toLocaleDateString()}</Text>
        <Text>Created by: {goal.creator}</Text>

        {account === goal.creator && (
          <Group mt="lg">
            <Button leftSection={<IconEdit size={14} />} onClick={handleEdit}>
              Edit
            </Button>
            <Button leftSection={<IconTrash size={14} />} color="red" onClick={handleDelete}>
              Delete
            </Button>
          </Group>
        )}
      </Paper>
    </Container>
  );
}