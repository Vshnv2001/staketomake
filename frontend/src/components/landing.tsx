import React from 'react';
import { Container, Title, Text, Stack, Image, Button, Group, SimpleGrid, Card, ThemeIcon } from '@mantine/core';
import { IconUsers, IconTarget, IconTrophy, IconLock, IconProps } from '@tabler/icons-react';
import sample_1 from '../assets/sample_1.png';

interface FeatureItem {
  icon: React.FC<IconProps>;
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  { icon: IconUsers, title: 'Join a Community', description: 'Connect with like-minded individuals who will support your journey.' },
  { icon: IconTarget, title: 'Set Clear Goals', description: 'Define and track your objectives with our intuitive platform.' },
  { icon: IconTrophy, title: 'Achieve More', description: 'Stay motivated and celebrate your successes along the way.' },
  { icon: IconLock, title: 'Secure & Transparent', description: 'Benefit from our Web3-powered, blockchain-based tracking system.' },
];

interface FeatureCardProps extends FeatureItem { }

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => (
  <Card shadow="sm" padding="lg" radius="md" withBorder>
    <ThemeIcon size="xl" radius="md" variant="light" color="blue" className="mb-4">
      <Icon size={28} stroke={1.5} />
    </ThemeIcon>
    <Text fw={700} size="lg" mb="xs">{title}</Text>
    <Text size="sm" c="dimmed">{description}</Text>
  </Card>
);

const Landing: React.FC = () => {
  return (
    <Container size="xl" className="py-16">
      <Stack gap="xl" align="center">
        <Title order={1} className="text-center text-4xl font-bold mb-4" ta="center">
          Transform Your Goals into Achievements
        </Title>
        <Text size="xl" className="text-center mb-8" maw={600} ta="center">
          Join a community that holds you accountable and propels you towards success.
        </Text>

        <Group className="mb-12">
          <Button size="lg" color="blue">Sign Up Now</Button>
          <Button size="lg" variant="outline" color="blue">Learn More</Button>
        </Group>

        <Image
          src={sample_1.src}
          alt="Goal Tracking Platform"
          className="rounded-lg shadow-md mb-12"
          style={{ maxWidth: '100%', height: 'auto' }}
        />

        <Title order={2} className="text-center text-3xl font-semibold mb-8">
          Why Choose Our Platform?
        </Title>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" className="mb-12">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </SimpleGrid>

        <Text size="xl" fw={700} className="text-center mb-6">
          Ready to start your journey?
        </Text>

        <Button size="lg" color="blue">
          Get Started Today
        </Button>
      </Stack>
    </Container>
  );
}

export default Landing;