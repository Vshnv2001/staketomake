import { Container, Loader, Modal, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import GoalHeader from '../../components/goals/goalheader';
import CompletedGoalView from '../../components/goals/completedgoalview';
import PendingVerifications from '../../components/goals/pendingverifications';
import SubmissionButton from '../../components/goals/submissionbutton';
import SubmissionHistory from '../../components/goals/submissionhistory';
import Layout from '../../components/layout/layout';
import { Goal, Submission, SubmissionStatus } from '../../types/goal';
import { getGoalDetails, updateGoal, uploadPhoto } from '../../utils/api';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

export default function GoalDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useDynamicContext();
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
  }, [id]);

  if (!goalData) {
    return <Layout><Container><Loader size="xl" /></Container></Layout>;
  }

  // const submissionsList = goalData.submissions.some(s => s.person === user?.firstName && s.status === 'pending submission')
  const isParticipant = goalData.participants.includes(user?.userId ?? "test");
  const canJoin = !isParticipant && goalData.status === 'Not Started';
  const canSubmit = isParticipant && goalData.status === 'In Progress';
  const pendingVerifications = goalData.submissions.filter(s => s.status === 'pending verification');


  const handleUpdateGoal = async (updateData: Partial<Goal>) => {
    if (!user?.userId || !id) return;
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
    if (!user?.userId) return;
    const participantsList = [...(goalData.participants || []), user?.userId ?? "test"]
    handleUpdateGoal({ participants: participantsList, participantsCnt: participantsList.length });
  };

  const handleLeaveGoal = () => {
    if (!user?.userId) return;
    const participantsList = goalData.participants.filter(p => p !== user?.userId)
    handleUpdateGoal({ participants: participantsList, participantsCnt: participantsList.length });
  };

  const handleSubmitPhoto = async (file: File) => {
    if (!file || !user?.userId) return;
    // Logic to upload file and get URL
    const photoUrl = await uploadPhoto(goalData.id, file);
    const newSubmission: Submission = {
      id: Date.now().toString(),
      day: goalData.currentDay,
      person: user?.firstName ?? '',
      status: 'pending verification',
      photoUrl: photoUrl
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

  const handleViewPhoto = (submission: Submission) => {
    setSelectedSubmission(submission);
    open();
  };

  return (
    <Layout>
      <Container size="lg">
        <Stack gap="xl">
          <GoalHeader 
            goalData={goalData}
            isParticipant={isParticipant}
            canJoin={canJoin} 
            onJoin={handleJoinGoal}
            onLeave={handleLeaveGoal}
            isLoading={isLoading}
          />
          
          {goalData.status === 'Completed' ? (
            <CompletedGoalView goalData={goalData} onViewPhoto={handleViewPhoto} />
          ) : (
            <>
              {canSubmit && (
                <SubmissionButton onSubmit={handleSubmitPhoto} isLoading={isLoading} />
              )}

              {isParticipant && goalData.status === 'In Progress' && pendingVerifications.length > 0 && (
                <PendingVerifications
                  verifications={pendingVerifications}
                  onVerify={handleVerify}
                  onViewPhoto={handleViewPhoto} 
                  isLoading={isLoading} 
                />
              )}

              <SubmissionHistory
                submissions={goalData.submissions}
                onViewPhoto={handleViewPhoto}
              />
            </>
          )}
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