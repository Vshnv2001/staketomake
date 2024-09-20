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
import { Goal, Submission } from '../../types/goal';
import { getGoalDetails } from '../../utils/api';

export default function GoalDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { account } = useWeb3();
  const [goalData, setGoalData] = useState<Goal | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      getGoalDetails(id as string)
        .then(setGoalData)
        .finally(() => setIsLoading(false));
    }
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
              isLoading={isLoading}
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