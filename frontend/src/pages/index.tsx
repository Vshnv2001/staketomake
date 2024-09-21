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
  List,
  Box,
} from '@mantine/core';
import { IconTarget, IconCoinBitcoin, IconUsers, IconTrophy, IconProps, IconCashBanknote, IconDeviceMobile, IconBuildingBank } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import Layout from '../components/layout/layout';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import Landing from '../components/landing';

interface StepCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<IconProps>;
}

const steps: StepCardProps[] = [
  {
    title: 'Choose a Health Goal',
    description: 'Find a health goal that fits your preferences.',
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

const features = [
  {
    title: "Unique Monetary and Social Motivation Mechanism",
    description: "Stake money on group challenges, earn rewards based on participation and group success, and receive social encouragement from challenge participants.",
    icon: IconCashBanknote,
  },
  {
    title: "Consumer-First Approach for User Adoption",
    description: "Easy onboarding through Telegram integration, no prior crypto knowledge required, and simplified blockchain experience with easy wallet creation.",
    icon: IconDeviceMobile,
  },
  {
    title: "Secure and Transparent Goal Tracking",
    description: "Leverage blockchain technology for secure and transparent tracking of your goals and rewards.",
    icon: IconBuildingBank,
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

const FeatureCard: React.FC<StepCardProps> = ({ title, description, icon: Icon }) => (
  <Card shadow="sm" padding="xl" radius="md" withBorder className="h-full">
    <Group>
      <ThemeIcon size="xl" radius="md" variant="light" color="teal" className="mb-4">
        <Icon size={28} stroke={1.5} />
      </ThemeIcon>
      <Box>
        <Text size="lg" fw={700} className="mb-2">{title}</Text>
        <Text size="sm" c="dimmed">{description}</Text>
      </Box>
    </Group>
  </Card>
);

const Home: React.FC = () => {
  const router = useRouter();
  const { authToken } = useDynamicContext();

  return (
    <Layout>
      <Container size="xl" className="py-16">
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
          <Title order={2} className="text-center mb-8">Key Differentiating Features</Title>
          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg" className="mb-16">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </SimpleGrid>

          <Group justify="center" className="mb-16">
            <Button size="lg" onClick={() => router.push('/goals')}>
              Explore Health Goals
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push('/goals/create')}>
              Create a Health Goal
            </Button>
          </Group>
        </Stack>
      </Container>
    </Layout>
  );
};

export default Home;