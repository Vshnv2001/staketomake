import { Button, Container, Loader, Modal, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import GoalHeader from '../../components/goals/goalheader';
import PendingVerifications from '../../components/goals/pendingverifications';
import SubmissionButton from '../../components/goals/submissionbutton';
import SubmissionHistory from '../../components/goals/submissionhistory';
import Layout from '../../components/layout/layout';
import { Goal, Submission, SubmissionStatus } from '../../types/goal';
import { getGoalDetails, updateGoal } from '../../utils/api';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

export default function GoalDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { authToken, user } = useDynamicContext();
  const [goalData, setGoalData] = useState<Goal | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const fetchGoalDetails = async () => {
      setIsLoading(true);
      try {
        const data = await getGoalDetails(id as string);
        setGoalData(data);
      } catch (error) {
        console.error('Error fetching goal details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchGoalDetails();
    }
  }, [id, goalData]);



  if (!goalData) {
    return <Layout><Container><Loader size="xl" /></Container></Layout>;
  }

  const isParticipant = !!authToken && goalData.participants.includes(authToken);
  const canJoin = !isParticipant && goalData.status === 'Not Started';
  const canSubmit = isParticipant && goalData.status === 'In Progress' &&
    goalData.submissions.some(s => s.person === user?.firstName && s.status === 'pending submission');
  const pendingVerifications = goalData.submissions.filter(s => s.status === 'pending verification');

  const handleUpdateGoal = async (updateData: Partial<Goal>) => {
    if (!authToken || !id) return;
    setIsLoading(true);
    try {
      const updatedGoal = await updateGoal(id as string, updateData);
      setGoalData(updatedGoal);
    } catch (error) {
      console.error('Error updating goal:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleJoinGoal = () => {
    if (!authToken) return;
    handleUpdateGoal({ participants: [...(goalData.participants || []), authToken!] });
  };

  const handleSubmitPhoto = async (file: File) => {
    if (!file || !authToken) return;  // Check if file and authToken exist

    // need some logic here to upload the file to some server for url
    const photoUrl = 'https://example.com/placeholder.jpg';  

    const newSubmission: Submission = {
      id: Date.now().toString(), // Generate a temporary ID
      day: goalData.currentDay,
      person: user?.firstName || user?.alias || '',
      status: 'pending verification',
      photoUrl
    };

    handleUpdateGoal({
      submissions: [...goalData.submissions, newSubmission]
    });
  };

  const handleVerify = (submission: Submission, isApproved: boolean) => {
    const updatedSubmissions = goalData.submissions.map(s =>
      s.id === submission.id ? { ...s, status: isApproved ? 'completed' as SubmissionStatus : 'rejected' as SubmissionStatus } : s
    );
    handleUpdateGoal({ submissions: updatedSubmissions });
  };

  return (
    <Layout>
      <Container size="lg">
        <Stack gap="xl">
          <GoalHeader goalData={goalData} />

          {canJoin && (
            <Button onClick={handleJoinGoal} loading={isLoading}>
              Join Goal
            </Button>
          )}

          {canSubmit && (
            <SubmissionButton onSubmit={handleSubmitPhoto} isLoading={isLoading} />
          )}

          {isParticipant && goalData.status === 'In Progress' && pendingVerifications.length > 0 && (
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