import React from 'react';
import {
  Container,
  Title,
  Text,
  Button,
  SimpleGrid,
  Card,
  Group,
  ThemeIcon,
  Stack,
} from '@mantine/core';
import { IconTarget, IconCoinBitcoin, IconUsers, IconTrophy, IconProps } from '@tabler/icons-react'; // Import IconProps
import { useRouter } from 'next/router';
import Layout from '../components/layout/layout';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import Landing from '../components/landing';

// Define a type for the icon component prop, now using IconProps
interface StepCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<IconProps>;
}

const steps: StepCardProps[] = [
  {
    title: 'Choose a Health Goal',
    description: 'Find a health goal that fits your prefrences.',
    icon: IconTarget,
  },
  {
    title: 'Bet on yourself',
    description: 'Place a bet and feel the motivation kick in.',
    icon: IconCoinBitcoin,
  },
  {
    title: 'Create that habit',
    description: 'Go along your habit creation journey with your friends.',
    icon: IconUsers,
  },
  {
    title: 'Cash out',
    description: 'Get back their bet + a profit if you win, it pays to win!',
    icon: IconTrophy,
  },
];

const StepCard: React.FC<StepCardProps> = ({ title, description, icon: Icon }) => (
  <Card shadow="sm" padding="lg" radius="md" withBorder className="h-full">
    <ThemeIcon size="xl" radius="md" variant="light" color="blue" className="mb-4">
      <Icon size={28} stroke={1.5} />
    </ThemeIcon>
    <Text size="lg" fw={500} className="mb-2">{title}</Text>
    <Text size="sm" c="dimmed">{description}</Text>
  </Card>
);

const Home: React.FC = () => {
  const router = useRouter();
  const { authToken } = useDynamicContext();

  return (
    <Layout>
      <Container size="xl" className="py-16">
        {!!authToken ? (
          <Stack gap="xl">
            <Stack justify="center" className="mb-16">
              <Title order={1} className="text-center mb-2">Welcome to Stake to Make</Title>
              <Text size="xl" c="dimmed" className="text-center mb-12">
                Set, monitor, and achieve your health goals with our Web3-powered platform.
              </Text>

              <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg" className="mb-12">
                {steps.map((step) => (
                  <StepCard key={step.title} {...step} />
                ))}
              </SimpleGrid>
            </Stack>

            <Group justify="center" className="mb-16">
              <Button size="lg" onClick={() => router.push('/goals')}>
                Explore Health Goals
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push('/goals/create')}>
                Create a Health Goal
              </Button>
            </Group>

            <Title order={2} className="text-center mb-4">Key Features</Title>
            <SimpleGrid cols={{ base: 1 }} spacing="sm" className="mx-auto">
              <Text>• Create and manage personal goals</Text>
              <Text>• Join community goals and challenges</Text>
              <Text>• Earn rewards for completing goals</Text>
              <Text>• Secure and transparent goal tracking with blockchain technology</Text>
            </SimpleGrid>
          </Stack>
        ) : (
          <Landing />
        )}
      </Container>
    </Layout>
  );
};

export default Home;
