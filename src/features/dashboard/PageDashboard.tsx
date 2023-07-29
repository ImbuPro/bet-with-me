import React, { useContext, useEffect, useState } from 'react';

import { Button, Card, Heading, Stack, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { Page, PageContent } from '@/components/Page';
import { Select } from '@/components/Select';
import { useToastSuccess } from '@/components/Toast';
import { WebSocketContext } from '@/features/dashboard/WebSockerProvider';
import {
  useBets,
  useSendBets,
  useUpdateBet,
} from '@/features/dashboard/service';
import { useUserList } from '@/features/users/service';
import { Loader } from '@/layout/Loader';

export default function PageDashboard() {
  const { t } = useTranslation(['dashboard']);
  const { messages, send } = useContext(WebSocketContext);
  const toast = useToastSuccess();

  const [targetUsername, setTargetUsername] = useState(''); // The selected receiver's username

  const { data: users } = useUserList();
  const { data: bets, isLoading, refetch } = useBets();
  const { mutate: sendBet, isLoading: isSending } = useSendBets();
  useEffect(() => {
    refetch();
    toast({
      title: bets?.[bets.length - 1]?.sender,
      description: bets?.[bets.length - 1]?.description,
    });
  }, [messages]);

  const handleChanged = (event: any) => {
    setTargetUsername(event.value);
  };

  const [betFilter, setBetFilter] = useState('PENDING');

  const { mutate: acceptBet, isLoading: isAccepting } =
    useUpdateBet('ACCEPTED');
  const { mutate: declineBet, isLoading: isRefusing } =
    useUpdateBet('DECLINED');
  return (
    <Page>
      <PageContent>
        <Heading size="md" mb="4">
          {t('dashboard:title')}
        </Heading>
        <Stack direction="row" mb={4}>
          <Button onClick={() => setBetFilter('PENDING')}>Pending</Button>
          <Button onClick={() => setBetFilter('ACCEPTED')}>Accepted</Button>
          <Button onClick={() => setBetFilter('DECLINED')}>Declined</Button>
          <Button onClick={() => setBetFilter('LOST')}>Lost</Button>
          <Button onClick={() => setBetFilter('WON')}>Won</Button>
        </Stack>

        <Stack mb={6} spacing={4}>
          {isLoading ? (
            <Loader />
          ) : (
            bets
              ?.filter((bet) => bet.betStatus === betFilter)
              .map((bet, index) => (
                <Card key={index} p={4}>
                  <Stack>
                    <Stack direction="row">
                      <Text fontWeight="bold">From :</Text>
                      <Text>{bet.sender}</Text>
                    </Stack>
                    <Stack direction="row">
                      <Text fontWeight="bold">Message :</Text>
                      <Text>{bet.description}</Text>
                    </Stack>
                    <Stack direction="row">
                      <Text fontWeight="bold">Amount :</Text>
                      <Text>{bet.betAmount} EUR</Text>
                    </Stack>
                    <Stack direction="row">
                      <Text fontWeight="bold">Deadline :</Text>
                      <Text>
                        {dayjs(bet.betDeadline).format('DD/MM/YYYY HH:mm')}
                      </Text>
                    </Stack>
                    {bet.betStatus !== 'PENDING' ? (
                      <Stack direction="row">
                        <Text fontWeight="bold">Status :</Text>
                        <Text>{bet.betStatus}</Text>
                      </Stack>
                    ) : (
                      <Stack flex={1} direction="row" mt={4}>
                        <Button
                          isLoading={isAccepting || isRefusing}
                          onClick={() => {
                            acceptBet(bet);
                            refetch();
                          }}
                          flex={1}
                          colorScheme="success"
                        >
                          Accept
                        </Button>
                        <Button
                          isLoading={isAccepting || isRefusing}
                          onClick={() => {
                            declineBet(bet);
                            refetch();
                          }}
                          flex={1}
                          colorScheme="error"
                        >
                          Decline
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                </Card>
              ))
          )}
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
          isLoading={isSending}
          onClick={() => {
            sendBet({
              betAmount: 10,
              betDeadline: new Date().toString(),
              description: 'test',
              receiver: targetUsername,
              createdAt: new Date().toString(),
            });
            send({
              type: 'message',
              betAmount: 10,
              betDeadline: new Date().toString(),
              description: 'test',
              receiver: targetUsername,
              createdAt: new Date().toString(),
            });
          }}
        >
          Send message
        </Button>
      </PageContent>
    </Page>
  );
}
