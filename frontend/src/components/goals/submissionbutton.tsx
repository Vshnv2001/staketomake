import React from 'react';
import { Card, Group, Text, FileButton, Button } from '@mantine/core';
import { IconPhoto } from '@tabler/icons-react';

interface SubmissionButtonProps {
  onSubmit: (file: File | null) => void;
}

export default function SubmissionButton({ onSubmit }: SubmissionButtonProps) {
  return (
    <Card withBorder shadow="sm" p="md">
      <Group justify="space-between">
        <Text fw={500}>{"Today's Submission"}</Text>
        <FileButton onChange={onSubmit} accept="image/png,image/jpeg">
          {(props) => <Button {...props} leftSection={<IconPhoto size={20} />}>Submit Photo</Button>}
        </FileButton>
      </Group>
    </Card>
  );
}