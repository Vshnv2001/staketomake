import { ActionIcon, Badge, Button, Card, Grid, Group, LoadingOverlay, Modal, Paper, Text, Tooltip } from '@mantine/core';
import { IconCheck, IconPhoto, IconX } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Submission } from '../../types/goal';

interface PendingVerificationsProps {
  verifications: Submission[];
  onVerify: (submission: Submission, isApproved: boolean) => void;
  onViewPhoto: (submission: Submission) => void;
  isLoading: boolean;
}

export default function PendingVerifications({ verifications, onVerify, onViewPhoto, isLoading }: PendingVerificationsProps) {
  const [confirmationModal, setConfirmationModal] = useState<{ isOpen: boolean; submission: Submission | null; isApproved: boolean }>({
    isOpen: false,
    submission: null,
    isApproved: false,
  });
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleVerify = (submission: Submission, isApproved: boolean) => {
    setConfirmationModal({ isOpen: true, submission, isApproved });
  };

  const confirmVerify = () => {
    if (confirmationModal.submission) {
      setRemovingId(confirmationModal.submission.id);
      onVerify(confirmationModal.submission, confirmationModal.isApproved);
      setTimeout(() => setRemovingId(null), 500); // Reset after animation
    }
    setConfirmationModal({ isOpen: false, submission: null, isApproved: false });
  };

  if (verifications.length === 0 && !isLoading) {
    return null;
  }

  return (
    <Paper shadow="xs" p="md" radius="md" pos="relative">
      <LoadingOverlay visible={isLoading} overlayProps={{ radius: 'sm', blur: 2 }} loaderProps={{ color: 'pink', type: 'bars' }} />
      <Text size="xl" fw={700} mb="md">Pending Verifications</Text>
      <Grid>
        <AnimatePresence>
          {verifications.map((submission) => (
            <Grid.Col
              key={submission.id}
              span={4}
            >
              <motion.div
                layout
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                animate={removingId === submission.id ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card shadow="xs" padding="sm" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <Text fw={500}>{submission.person}</Text>
                    <Badge>Day {submission.day}</Badge>
                  </Group>
                  <Group justify="space-between" mt="md">
                    <Tooltip label="View Photo">
                      <ActionIcon variant="light" onClick={() => onViewPhoto(submission)}>
                        <IconPhoto size={20} />
                      </ActionIcon>
                    </Tooltip>
                    <Group gap="xs">
                      <Tooltip label="Approve">
                        <ActionIcon color="green" variant="light" onClick={() => handleVerify(submission, true)}>
                          <IconCheck size={20} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Reject">
                        <ActionIcon color="red" variant="light" onClick={() => handleVerify(submission, false)}>
                          <IconX size={20} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Group>
                </Card>
              </motion.div>
            </Grid.Col>
          ))}
        </AnimatePresence>
      </Grid>

      <Modal
        opened={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false, submission: null, isApproved: false })}
        title={confirmationModal.isApproved ? "Approve Submission" : "Reject Submission"}
      >
        <Text>Are you sure you want to {confirmationModal.isApproved ? "approve" : "reject"} this submission?</Text>
        <Group justify="space-between" mt="md">
          <Button variant="outline" onClick={() => setConfirmationModal({ isOpen: false, submission: null, isApproved: false })}>
            Cancel
          </Button>
          <Button color={confirmationModal.isApproved ? "green" : "red"} onClick={confirmVerify}>
            Confirm
          </Button>
        </Group>
      </Modal>
    </Paper>
  );
}
