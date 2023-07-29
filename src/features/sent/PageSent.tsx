import { Card, Stack, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';

import { Page, PageContent } from '@/components/Page';
import { useSentBets } from '@/features/sent/service';
import { Loader } from '@/layout/Loader';

export default function PageSent() {
  const { data: bets, isLoading } = useSentBets();
  return (
    <Page>
      <PageContent>
        <Stack mb={6} spacing={4}>
          {isLoading ? (
            <Loader />
          ) : !bets || !bets.length ? (
            <Stack flex={1} textAlign="center">
              <Text fontWeight="bold">You have no sent bets</Text>
            </Stack>
          ) : (
            bets?.map((bet, index) => (
              <Card key={index} p={4}>
                <Stack>
                  <Stack direction="row">
                    <Text fontWeight="bold">To :</Text>
                    <Text>{bet.receiver}</Text>
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
                  <Stack direction="row">
                    <Text fontWeight="bold">Status :</Text>
                    <Text>{bet.betStatus}</Text>
                  </Stack>
                </Stack>
              </Card>
            ))
          )}
        </Stack>
      </PageContent>
    </Page>
  );
}
