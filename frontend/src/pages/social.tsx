import Layout from '@/components/layout/layout';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Button, Container, Group, Stack, Text, Title } from '@mantine/core';
import { useState } from 'react';


const Social = () => {

  const [telegramId, setTelegramId] = useState('');
  const { authToken, primaryWallet } = useDynamicContext();

  const handleSave = () => {
    // TODO: fix this, not sure what we are using for user id.
    fetch(`http://localhost:8000/api/telegram/${primaryWallet?.address}?telegram_id=${telegramId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        'user_id': primaryWallet?.address,
        'telegram_id': telegramId,
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

    return (
        <Layout>
        <Container size="lg">
          <Stack gap="xl" mt={50}>
            <Group justify='space-between'>
              <Stack>
                <Title order={1}>Social IDs</Title>
                <Text size="sm" color="dimmed">Add your Telegram ID and instantly upload photos of your progress from Telegram!</Text>
              </Stack>
            </Group>
          <Group >
            <Text style={{ fontWeight: 700 }}>Telegram ID</Text>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Text style={{ fontWeight: 700, marginRight: 2 }}>@</Text>
              <input type="text" placeholder="username" style={{ flex: 1 }} value={telegramId} onChange={(e) => setTelegramId(e.target.value)} />
            </div>
          </Group>
          <Button onClick={handleSave}>Save</Button>
          </Stack>
        </Container>
      </Layout>
    );
};

export default Social;