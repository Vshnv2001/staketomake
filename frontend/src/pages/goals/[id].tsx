import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Stack, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useWeb3 } from '../../contexts/web3context';
import Layout from '../../components/layout/layout';
import GoalHeader from '../../components/goals/goalheader';
import SubmissionButton from '../../components/goals/submissionbutton';
import PendingVerifications from '../../components/goals/pendingverifications';
import SubmissionHistory from '../../components/goals/submissionhistory';
import { GoalData, Submission } from '../../types/goal';

const mockGoalData: GoalData = {
  id: '1',
  name: 'Daily Exercise Challenge',
  amountStaked: 0.5,
  participants: 3,
  startDate: '2024-09-01',
  endDate: '2024-09-03',
  currentDay: 3,
  totalDays: 3,
  submissions: [
    { day: 3, person: 'person 2', status: 'pending submission' },
    { day: 3, person: 'person 3', status: 'pending verification', photoUrl: 'https://example.com/photo3.jpg' },
    { day: 2, person: 'person 1', status: 'completed', photoUrl: 'https://example.com/photo1.jpg' },
    { day: 2, person: 'person 2', status: 'missing' },
    { day: 2, person: 'person 3', status: 'rejected', photoUrl: 'https://example.com/photo2.jpg' },
    { day: 1, person: 'person 1', status: 'completed', photoUrl: 'https://example.com/photo4.jpg' },
    { day: 1, person: 'person 2', status: 'completed', photoUrl: 'https://example.com/photo5.jpg' },
    { day: 1, person: 'person 3', status: 'completed', photoUrl: 'https://example.com/photo6.jpg' },
  ],
};

export default function GoalDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { account } = useWeb3();
  const [goalData, setGoalData] = useState<GoalData | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    // In a real application, you would fetch the goal data based on the ID
    setGoalData(mockGoalData);
  }, [id]);

  if (!goalData) {
    return <Layout><Container>Loading...</Container></Layout>;
  }

  const canSubmit = account && goalData.submissions.some(s => s.person === account && s.status === 'pending submission');
  const pendingVerifications = goalData.submissions.filter(s => s.status === 'pending verification');

  const handleSubmitPhoto = (file: File | null) => {
    if (file) {
      console.log('Submitting photo:', file);
      // Implement photo submission logic here
    }
  };

  const handleVerify = (submission: Submission, isApproved: boolean) => {
    console.log(`${isApproved ? 'Approving' : 'Rejecting'} submission:`, submission);
    // Implement verification logic here
  };

  return (
    <Layout>
      <Container size="lg">
        <Stack gap="xl">
          <GoalHeader goalData={goalData} />
          {canSubmit && <SubmissionButton onSubmit={handleSubmitPhoto} />}
          {pendingVerifications.length > 0 && (
            <PendingVerifications
              verifications={pendingVerifications}
              onVerify={handleVerify}
              onViewPhoto={(submission) => { setSelectedSubmission(submission); open(); }}
            />
          )}
          <SubmissionHistory
            submissions={goalData.submissions}
            onViewPhoto={(submission) => { setSelectedSubmission(submission); open(); }}
          />
        </Stack>
      </Container>

      <Modal opened={opened} onClose={close} title="Submission Photo">
        {selectedSubmission && selectedSubmission.photoUrl && (
          <img src={selectedSubmission.photoUrl} alt="Submission" style={{ maxWidth: '100%', height: 'auto' }} />
        )}
      </Modal>
    </Layout>
  );
}