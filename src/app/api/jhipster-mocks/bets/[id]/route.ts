import { NextResponse } from 'next/server';
import { z } from 'zod';

import { apiMethod } from '@/app/api/jhipster-mocks/_helpers/api';
import { db } from '@/app/api/jhipster-mocks/_helpers/db';

export const PUT = apiMethod({
  handler: async ({ req, params }) => {
    const zBetStatus = () =>
      z.object({
        betStatus: z.enum(['PENDING', 'ACCEPTED', 'DECLINED', 'LOST', 'WON']),
      });

    const parsedBody = zBetStatus().safeParse(await req.json());
    const safeParams = z
      .object({
        id: z.string(),
      })
      .safeParse(params);

    if (parsedBody.success && safeParams.success) {
      const updatedBet = await db.bets.update({
        where: { id: Number(safeParams.data.id) },
        data: {
          betStatus: parsedBody.data.betStatus,
        },
      });
      return NextResponse.json(updatedBet);
    }
  },
});
