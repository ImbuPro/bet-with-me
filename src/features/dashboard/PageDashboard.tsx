import React, { useContext, useEffect, useState } from 'react';

import { Button, Card, Heading, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { SingleValue } from 'react-select';

import { Page, PageContent } from '@/components/Page';
import { Select } from '@/components/Select';
import { useToastSuccess } from '@/components/Toast';
import { useAccount } from '@/features/account/service';
import { WebSocketContext } from '@/features/dashboard/WebSockerProvider';
import { useUserList } from '@/features/users/service';

export default function PageDashboard() {
  const { t } = useTranslation(['dashboard']);
  const { messages, send } = useContext(WebSocketContext);
  const toast = useToastSuccess();
  const { data: user } = useAccount();

  const username = user?.login ?? 'Unknown';
  const [targetUsername, setTargetUsername] = useState(''); // The selected receiver's username

  const { data: users } = useUserList();

  useEffect(() => {
    toast({
      title: messages[messages.length - 1]?.username,
      description: messages[messages.length - 1]?.message,
    });
  }, [messages]);

  const handleChanged = (event: any) => {
    setTargetUsername(event.value);
  };

  return (
    <Page>
      <PageContent>
        <Heading size="md" mb="4">
          {t('dashboard:title')}
        </Heading>
        <Stack mb={6} spacing={4}>
          {messages.map((message, index) => (
            <Card key={index} p={4}>
              <Text fontWeight="bold">{message.username}</Text>
              <Text>{message.message}</Text>
            </Card>
          ))}
        </Stack>
        <Select
          options={users?.users.map((user) => {
            return {
              label: user.login,
              value: user.login,
            };
          })}
          onChange={handleChanged}
        />
        <Button
          onClick={() =>
            send({ type: 'message', username, targetUsername, message: 'Test' })
          }
        >
          Send message
        </Button>
      </PageContent>
    </Page>
  );
}
