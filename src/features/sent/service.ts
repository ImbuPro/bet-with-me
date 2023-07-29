import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { zBet } from '@/features/dashboard/service';

export const useSentBets = () =>
  useQuery({
    queryKey: ['sentBets'],
    queryFn: async () => {
      const response = await axios.get('/bets/sent');
      return zBet().array().parse(response.data);
    },
  });
