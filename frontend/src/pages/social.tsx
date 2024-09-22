import Layout from '@/components/layout/layout';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Button, Container, Group, Stack, Text, Title } from '@mantine/core';
import { useState } from 'react';


const Social = () => {

  const [telegramId, setTelegramId] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const { authToken, primaryWallet, user } = useDynamicContext();

  const handleSave = () => {
    // TODO: fix this, not sure what we are using for user id.
    setIsSaved(false);
    setIsChanged(false);
    fetch(`http://localhost:8000/api/telegram/${user?.userId}?telegram_id=${telegramId}&wallet_address=${primaryWallet?.address}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        'user_id': user?.userId,
        'telegram_id': telegramId,
        'wallet_address': primaryWallet?.address
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      setIsSaved(true);
      setIsChanged(false);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

    return (
        <Layout>
        <Container size="sm">
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
              <input type="text" placeholder="username" style={{ flex: 1 }} value={telegramId} onChange={(e) => {setTelegramId(e.target.value); setIsChanged(true)}} />
            </div>
          </Group>
          <Button onClick={handleSave} disabled={!isChanged}>{isSaved ? 'Saved' : isChanged ? 'Save' : 'Saved'}</Button>
          </Stack>
        </Container>
      </Layout>
    );
};

export default Social;