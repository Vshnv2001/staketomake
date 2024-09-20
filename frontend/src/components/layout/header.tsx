import React from 'react';
import Link from 'next/link';
import {
  Menu,
  Group,
  Center,
  Burger,
  Container,
  Button,
  Tooltip,
} from '@mantine/core';
import { useDisclosure, useClipboard } from '@mantine/hooks';
import { IconChevronDown, IconWallet, IconCopy } from '@tabler/icons-react';
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
      { link: '/goals', label: 'Your Goals' },
    ],
  },
  { link: '/about', label: 'About' },
];

export function HeaderMenu() {
  const [opened, { toggle }] = useDisclosure(false);
  const { account, connectWallet, disconnectWallet } = useWeb3();
  const clipboard = useClipboard({ timeout: 1500 }); // Clipboard state with a 1.5-second timeout

  const handleWalletClick = () => {
    if (!account) {
      connectWallet();
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  const handleCopy = () => {
    if (account) {
      clipboard.copy(account);
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
            {account ? (
              <Menu
                width={200}
                trigger="hover" openDelay={100} closeDelay={400}
                position="bottom-end"

                withinPortal
              >
                <Menu.Target>
                  <Button
                    leftSection={<IconWallet size="1rem" />}
                    variant="outline"
                    onClick={handleWalletClick}
                  >
                    {`${account.slice(0, 6)}...${account.slice(-4)}`}
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IconCopy size="0.9rem" />}
                    onClick={handleCopy}
                  >
                    <Tooltip
                      label={clipboard.copied ? 'Copied!' : 'Copy Wallet ID'}
                      withArrow
                      position="right"
                      opened={clipboard.copied} // Tooltip opens only when copied
                    >
                      <span style={{ display: 'block' }}>
                        {clipboard.copied ? 'Copied!' : 'Copy Wallet ID'}
                      </span>
                    </Tooltip>
                  </Menu.Item>
                  <Menu.Item color="red" onClick={handleDisconnect}>
                    Disconnect
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Button
                leftSection={<IconWallet size="1rem" />}
                variant="outline"
                onClick={handleWalletClick}
              >
                Connect Wallet
              </Button>
            )}
          </Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
        </div>
      </Container>
    </header>
  );
}
