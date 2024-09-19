import React, { useState } from 'react';
import { Card, Stack, Text, Grid, Badge, ActionIcon, Tooltip, Group, Button, Transition, Box } from '@mantine/core';
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
    <Card withBorder shadow="sm" p="md">
      <Stack gap="lg">
        <Group justify="space-between">
          <Text fw={500}>Submission History</Text>
          <Button
            variant="subtle"
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
            <Card key={day} withBorder p="sm">
              <Group justify="space-between" mb="xs">
                <Text fw={500}>Day {day}</Text>
                <ActionIcon onClick={() => toggleDay(Number(day))}>
                  {expandedDays.includes(Number(day)) ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                </ActionIcon>
              </Group>
              <Transition
                mounted={expandedDays.includes(Number(day))}
                transition="slide-down"
                duration={300}
                timingFunction="ease"
              >
                {(styles) => (
                  <Box style={styles}>
                    <Grid>
                      {daySubmissions.map((submission, index) => (
                        <Grid.Col key={index} span={4}>
                          <Card withBorder shadow="sm" h={100}>
                            <Stack justify="space-between" h="100%">
                              <Text fw={500}>{submission.person}</Text>
                              <Group justify="space-apart">
                                <Badge color={statusColors[submission.status]}>{submission.status}</Badge>
                                {submission.photoUrl && (
                                  <Tooltip label="View Photo">
                                    <ActionIcon onClick={() => onViewPhoto(submission)}>
                                      <IconPhoto size={20} />
                                    </ActionIcon>
                                  </Tooltip>
                                )}
                              </Group>
                            </Stack>
                          </Card>
                        </Grid.Col>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Transition>
            </Card>
          ))}
      </Stack>
    </Card>
  );
}