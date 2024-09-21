import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Title, TextInput, Textarea, NumberInput, Button, Group, Stack, Select, Switch, Alert } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import Layout from '../../components/layout/layout';
import { GoalFormValues } from '../../types/goal';
import { createGoal } from '../../utils/api';

export default function CreateGoal() {
  const router = useRouter();
  const { user } = useDynamicContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<GoalFormValues>({
    initialValues: {
      title: '',
      description: '',
      stakingAmount: 0,
      startDate: new Date(),
      endDate: new Date(),
      verificationMethod: '',
      isPublic: true,
      creator: user?.userId ?? "test",
      creatorName: user?.firstName ?? "test",
    },
    validate: {
      title: (value) => (value.trim().length > 0 ? null : 'Title is required'),
      description: (value) => (value.trim().length > 0 ? null : 'Description is required'),
      stakingAmount: (value) => (value > 0 ? null : 'Staking amount must be greater than 0'),
      endDate: (value, values) => (value > values.startDate ? null : 'End date must be after start date'),
      verificationMethod: (value) => (value ? null : 'Verification method is required'),
    },
  });

  const handleSubmit = async (values: GoalFormValues) => {
    if (!user?.userId) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const createdGoal = await createGoal(values);
      router.push(`/goals/${createdGoal.id}`);
    } catch (error) {
      console.error('Error creating goal:', error);
      setError('Failed to create goal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container size="sm">
        <Title order={1} mb="xl">Create New Goal</Title>
        {error && <Alert color="red" mb="md">{error}</Alert>}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              required
              label="Goal Title"
              placeholder="Enter your goal title"
              {...form.getInputProps('title')}
            />
            <Textarea
              required
              label="Description"
              placeholder="Describe your goal"
              minRows={3}
              {...form.getInputProps('description')}
            />
            <NumberInput
              required
              label="Staking Amount (ETH)"
              placeholder="Enter amount to stake"
              min={0}
              step={0.01}
              {...form.getInputProps('stakingAmount')}
            />
            <Group grow>
              <DatePickerInput
                required
                label="Start Date"
                placeholder="Pick start date"
                {...form.getInputProps('startDate')}
              />
              <DatePickerInput
                required
                label="End Date"
                placeholder="Pick end date"
                minDate={form.values.startDate}
                {...form.getInputProps('endDate')}
              />
            </Group>
            <Select
              required
              label="Verification Method"
              placeholder="Choose verification method"
              data={[
                { value: 'photo', label: 'Photo Submission' },
                { value: 'group', label: 'Group Verification' },
                { value: 'smart_contract', label: 'Smart Contract' },
              ]}
              {...form.getInputProps('verificationMethod')}
            />
            <Switch
              label="Make this goal public"
              {...form.getInputProps('isPublic', { type: 'checkbox' })}
            />
            <Button type="submit" loading={loading}>
              Create Goal
            </Button>
          </Stack>
        </form>
      </Container>
    </Layout>
  );
}