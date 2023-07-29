import React, { useContext, useEffect, useState } from 'react';

import { Button, Card, Heading, Stack, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

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
      description: messages[messages.length - 1]?.details?.description,
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
              <Stack>
                <Stack direction="row">
                  <Text fontWeight="bold">From :</Text>
                  <Text>{message.username}</Text>
                </Stack>
                <Stack direction="row">
                  <Text fontWeight="bold">Message :</Text>
                  <Text>{message.details?.description}</Text>
                </Stack>
                <Stack direction="row">
                  <Text fontWeight="bold">Amount :</Text>
                  <Text>
                    {message.details?.amount} {message.details?.currency}
                  </Text>
                </Stack>
                <Stack direction="row">
                  <Text fontWeight="bold">Deadline :</Text>
                  <Text>
                    {dayjs(message.details?.deadline).format(
                      'DD/MM/YYYY HH:mm'
                    )}
                  </Text>
                </Stack>
                {message.username !== 'Server' && (
                  <Stack flex={1} direction="row" mt={4}>
                    <Button flex={1} colorScheme="success">
                      Accept
                    </Button>
                    <Button flex={1} colorScheme="error">
                      Decline
                    </Button>
                  </Stack>
                )}
              </Stack>
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
            send({
              type: 'message',
              username,
              targetUsername,
              details: {
                amount: 1,
                currency: 'USD',
                description: 'test',
                deadline: dayjs().toDate(),
              },
            })
          }
        >
          Send message
        </Button>
      </PageContent>
    </Page>
  );
}
