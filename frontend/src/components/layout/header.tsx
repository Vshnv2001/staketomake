import React from 'react';
import Link from 'next/link';
import { Menu, Group, Center, Burger, Container, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconWallet } from '@tabler/icons-react';
import { MantineLogo } from '@mantinex/mantine-logo';
import classes from '../../styles/HeaderMenu.module.css';
import { useWeb3 } from '../../contexts/web3context';

const links = [
  { link: '/', label: 'Home' },
  {
    link: '#',
    label: 'Goals',
    links: [
      { link: '/goals/find', label: 'Find Goals' },
      { link: '/goals/create', label: 'Create Goal' },
<<<<<<< Updated upstream
      { link: '/goals', label: 'Your Goals' },
=======
      { link: '/goals/me', label: 'Your Goals' },
>>>>>>> Stashed changes
    ],
  },
  { link: '/about', label: 'About' },
];

export function HeaderMenu() {
  const [opened, { toggle }] = useDisclosure(false);
  const { account, connectWallet, disconnectWallet } = useWeb3();

  const handleWalletClick = () => {
    if (account) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item key={item.link}>
        <Link href={item.link} className={classes.link}>
          {item.label}
        </Link>
      </Menu.Item>
    ));

    if (menuItems) {
      return (
        <Menu key={link.label} trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
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
            <Button
              leftSection={<IconWallet size="1rem" />}
              variant="outline"
              onClick={handleWalletClick}
            >
              {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
            </Button>
          </Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
        </div>
      </Container>
    </header>
  );
}