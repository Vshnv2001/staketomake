import React, { useState } from 'react';
import { Paper, Text, Badge, ActionIcon, Tooltip, Group, Button, Transition, Box, Grid, Card } from '@mantine/core';
import { IconPhoto, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { Submission } from '../../types/goal';

interface SubmissionHistoryProps {
  submissions: Submission[];
  onViewPhoto: (submission: Submission) => void;
}

const statusColors = {
  completed: 'green',
  'pending submission': 'yellow',
  'pending verification': 'blue',
  missing: 'red',
  rejected: 'red',
};

export default function SubmissionHistory({ submissions, onViewPhoto }: SubmissionHistoryProps) {
  const [expandedDays, setExpandedDays] = useState<number[]>([]);

  const submissionsByDay = submissions.reduce((acc, submission) => {
    if (!acc[submission.day]) {
      acc[submission.day] = [];
    }
    acc[submission.day].push(submission);
    return acc;
  }, {} as Record<number, Submission[]>);

  const toggleDay = (day: number) => {
    setExpandedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <Paper shadow="xs" p="md" radius="md">
      <Group justify="space-between" mb="xl">
        <Text size="xl" fw={700}>Submission History</Text>
        <Button
          variant="light"
          onClick={() => setExpandedDays(
            expandedDays.length === Object.keys(submissionsByDay).length
              ? []
              : Object.keys(submissionsByDay).map(Number)
          )}
        >
          {expandedDays.length === Object.keys(submissionsByDay).length ? 'Collapse All' : 'Expand All'}
        </Button>
      </Group>
      {Object.entries(submissionsByDay)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([day, daySubmissions]) => (
          <Box key={day} mb="md">
            <Group justify="space-between" onClick={() => toggleDay(Number(day))} style={{ cursor: 'pointer' }}>
              <Text fw={600} size="lg">Day {day}</Text>
              <ActionIcon variant="subtle">
                {expandedDays.includes(Number(day)) ? <IconChevronUp size={20} /> : <IconChevronDown size={20} />}
              </ActionIcon>
            </Group>
            <Transition
              mounted={expandedDays.includes(Number(day))}
              transition="slide-down"
              duration={300}
              timingFunction="ease"
            >
              {(styles) => (
                <Box style={styles} mt="sm">
                  <Grid>
                    {daySubmissions.map((submission, index) => (
                      <Grid.Col key={index} span={4}>
                        <Card shadow="sm" padding="sm" radius="md" withBorder>
                          <Group justify="space-between" mb="xs">
                            <Text fw={500}>{submission.person}</Text>
                            {submission.photoUrl && (
                              <Tooltip label="View Photo">
                                <ActionIcon variant="light" onClick={() => onViewPhoto(submission)}>
                                  <IconPhoto size={20} />
                                </ActionIcon>
                              </Tooltip>
                            )}
                          </Group>
                          <Badge color={statusColors[submission.status]} fullWidth>
                            {submission.status}
                          </Badge>
                        </Card>
                      </Grid.Col>
                    ))}
                  </Grid>
                </Box>
              )}
            </Transition>
          </Box>
        ))}
    </Paper>
  );
}