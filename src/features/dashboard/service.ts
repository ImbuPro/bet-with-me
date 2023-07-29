import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod';

export type Bet = z.infer<ReturnType<typeof zBet>>;
export const zBet = () =>
  z.object({
    id: z.number(),
    sender: z.string(),
    receiver: z.string(),
    description: z.string(),
    betDeadline: z.string(),
    betAmount: z.number(),
    betStatus: z.string(),
    createdAt: z.string(),
    createdByUserId: z.number(),
  });

export const useBets = () =>
  useQuery({
    queryKey: ['bets'],
    queryFn: async () => {
      const response = await axios.get('/bets');
      return zBet().array().parse(response.data);
    },
  });

export const useSendBets = () =>
  useMutation({
    mutationKey: ['sendBets'],
    mutationFn: async (
      bet: Omit<Bet, 'sender' | 'betStatus' | 'createdByUserId' | 'id'>
    ) => {
      console.log('bet', bet);
      const response = await axios({
        method: 'post',
        url: '/bets',
        data: bet,
      });
      return zBet().parse(response.data);
    },
  });

export const useUpdateBet = (
  betStatus: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'WON' | 'LOST'
) =>
  useMutation({
    mutationKey: ['updateBet'],
    mutationFn: async (bet: Bet) => {
      const response = await axios({
        method: 'put',
        url: `/bets/${bet.id}`,
        data: { betStatus },
      });
      return zBet().parse(response.data);
    },
  });
