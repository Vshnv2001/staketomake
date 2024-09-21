import Layout from '@/components/layout/layout';
import { Container, Group, Stack, Text, Title } from '@mantine/core';


const About = () => {
    return (
        <Layout>
        <Container size="lg">
          <Stack gap="xl" mt={50}>
            <Group justify='space-between'>
              <Title order={1}>About StakeToMake</Title>
            </Group>
            <Text>StakeToMake is a platform that allows you to create and find goals that you can stake on.</Text>
            <Text>You can create a goal and stake on it, or find a goal and stake on it.</Text>
            <Text>You can also create a goal and find a goal.</Text>
          </Stack>
        </Container>
      </Layout>
    );
};

export default About;
