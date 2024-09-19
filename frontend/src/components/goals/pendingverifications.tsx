import React from 'react';
import { Card, Stack, Text, Group, ActionIcon, Tooltip } from '@mantine/core';
import { IconPhoto, IconCheck, IconX } from '@tabler/icons-react';
import { Submission } from '../../types/goal';

interface PendingVerificationsProps {
  verifications: Submission[];
  onVerify: (submission: Submission, isApproved: boolean) => void;
  onViewPhoto: (submission: Submission) => void;
}

export default function PendingVerifications({ verifications, onVerify, onViewPhoto }: PendingVerificationsProps) {
  return (
    <Card withBorder shadow="sm" p="md">
      <Stack gap="md">
        <Text fw={500}>Pending Verifications</Text>
        {verifications.map((submission, index) => (
          <Group key={index} justify="space-between">
            <Text>{submission.person} - Day {submission.day}</Text>
            <Group gap="xs">
              <Tooltip label="View Photo">
                <ActionIcon onClick={() => onViewPhoto(submission)}>
                  <IconPhoto size={20} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Approve">
                <ActionIcon color="green" onClick={() => onVerify(submission, true)}>
                  <IconCheck size={20} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Reject">
                <ActionIcon color="red" onClick={() => onVerify(submission, false)}>
                  <IconX size={20} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
        ))}
      </Stack>
    </Card>
  );
}
