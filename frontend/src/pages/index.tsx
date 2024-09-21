import React from 'react';
import { Container, Title, Text, Button, Group, Stack } from '@mantine/core';
import { useRouter } from 'next/router';
import Layout from '../components/layout/layout';
import {  useDynamicContext } from '@dynamic-labs/sdk-react-core';
import Landing from '../components/landing';
import { useState, useEffect } from 'react';

const Home: React.FC = () => {
  const router = useRouter();
  const { authToken, handleLogOut, user, setShowAuthFlow } = useDynamicContext();
  const [isSignedIn, setIsSignedIn] = useState(false);

  return (
    <Layout>
      <Container size="lg">
{        !!authToken ? (<Stack gap="xl" align="center" mt={50}>
          <Title order={1}>Welcome to Goal Tracker</Title>
          <Text size="xl">
            Set, monitor, and achieve your goals with our Web3-powered platform.
          </Text>
          <Group>
            <Button size="lg" onClick={() => router.push('/goals')}>
              Explore Goals
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push('/goals/create')}>
              Create a Goal
            </Button>
          </Group>
          <Stack gap="md" align="center" mt={50}>
            <Title order={2}>Key Features</Title>
            <Text>• Create and manage personal goals</Text>
            <Text>• Join community goals and challenges</Text>
            <Text>• Earn rewards for completing goals</Text>
            <Text>• Secure and transparent goal tracking with blockchain technology</Text>
          </Stack>
        </Stack>)
        : (
          <Stack gap="xl" align="center" mt={50}>
            <Landing />
          </Stack>
        )
      }
      </Container>
    </Layout>
  );
};

export default Home;