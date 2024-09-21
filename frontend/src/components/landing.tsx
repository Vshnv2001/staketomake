import React from 'react';
import { Container, Title, Text, Button, Group, Stack, Image } from '@mantine/core';
import sample_1 from '../assets/sample_1.png';

export default function Landing() {
  return (
    <Container size="lg">
    <Stack gap="xl" align="center" mt={50}>
      <Title order={1}>Find a Community That Holds You Accountable. Now.</Title>
      <Text size="xl">
        Set, monitor, and achieve your goals with our Web3-powered platform.
      </Text>
      <Image src={sample_1.src} alt="Sample 1" style={{ display: 'block', borderRadius: '10px', border: '1px solid #e0e0e0' }} />
      <Text size="md">
        Some Sample Text. WIP
      </Text>
      </Stack>
    </Container>
  );
}