import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import {
  Burger,
  Center,
  Container,
  Group,
  Menu,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MantineLogo } from '@mantinex/mantine-logo';
import { IconChevronDown } from '@tabler/icons-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Link from 'next/link';
import { mainnet } from 'viem/chains';
import { createConfig, http, WagmiProvider } from 'wagmi';
import classes from '../../styles/HeaderMenu.module.css';
import dynamic from 'next/dynamic';

const DynamicWidget = dynamic(
  () =>
    import('@dynamic-labs/sdk-react-core').then((mod) => mod.DynamicWidget),
  { ssr: false }
);

const DynamicWagmiConnector = dynamic(
  () =>
    import('@dynamic-labs/wagmi-connector').then(
      (mod) => mod.DynamicWagmiConnector
    ),
  { ssr: false }
);

const config = createConfig({
  chains: [mainnet],
  multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(),
  },
});

const queryClient = new QueryClient();

interface Link {
  link: string
  label: string
  links?: Link[]
}

export function HeaderMenu() {
  const [opened, { toggle }] = useDisclosure(false);
  const { authToken } = useDynamicContext();
  let links: Link[] = [];

  if (authToken) {
    links = [
      { link: '/', label: 'Home' },
      {
        link: '#',
        label: 'Goals',
        links: [
          { link: '/goals/find', label: 'Find Goals' },
          { link: '/goals/create', label: 'Create Goal' },
          { link: '/goals', label: 'Your Goals' },
        ],
      },
      { link: '/about', label: 'About' },
    ];
  } else {
    links = [
      { link: '/', label: 'Home' },
      { link: '/about', label: 'About' },
    ];
  }

  const items = links.map((link) => {
    const menuItems = link.links?.map((item: Link) => (
      <Menu.Item key={item.link}>
        <Link href={item.link} className={classes.link}>
          {item.label}
        </Link>
      </Menu.Item>
    ));

    if (menuItems) {
      return (
        <Menu
          key={link.label}
          trigger="hover"
          transitionProps={{ exitDuration: 0 }}
          withinPortal
        >
          <Menu.Target>
            <a
              href={link.link}
              className={classes.link}
              onClick={(event) => event.preventDefault()}
            >
              <Center>
                <span className={classes.linkLabel}>{link.label}</span>
                <IconChevronDown size="0.9rem" stroke={1.5} />
              </Center>
            </a>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <Link key={link.label} href={link.link} className={classes.link}>
        {link.label}
      </Link>
    );
  });

  return (
    <header className={classes.header}>
      <Container size="md">
        <div className={classes.inner}>
          <MantineLogo size={28} />
          <Group gap={5} visibleFrom="sm" className={classes.navGroup}>
            {items}
          </Group>
          <Group gap={5} visibleFrom="sm" className={classes.buttonGroup}>
            <WagmiProvider config={config}>
              <QueryClientProvider client={queryClient}>
                <DynamicWagmiConnector>
                  <DynamicWidget />
                </DynamicWagmiConnector>
              </QueryClientProvider>
            </WagmiProvider>
          </Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
        </div>
      </Container>
    </header>
  );
}
