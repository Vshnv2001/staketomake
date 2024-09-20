import React from 'react';
import { Card, Group, Text, FileButton, Button } from '@mantine/core';

interface SubmissionButtonProps {
  onSubmit: (file: File) => void;  // Change to accept a single File
  isLoading: boolean;
}

export default function SubmissionButton({ onSubmit }: SubmissionButtonProps) {
  return (
    <Card withBorder shadow="sm" p="md">
      <Group justify="space-between">
        <Text fw={500}>{"Today's Submission"}</Text>
        <FileButton onChange={(file) => file && onSubmit(file)} accept="image/png,image/jpeg">
          {(props) => <Button {...props}>Submit Photo</Button>}
        </FileButton>
      </Group>
    </Card>
  );
}
