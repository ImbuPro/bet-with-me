import { NextResponse } from 'next/server';

import { apiMethod } from '@/app/api/jhipster-mocks/_helpers/api';
import { db } from '@/app/api/jhipster-mocks/_helpers/db';
import { zBet } from '@/features/dashboard/service';

export const GET = apiMethod({
  handler: async ({ user }) => {
    const receiveBets = await db.bets.findMany({
      where: { receiver: user?.login ?? 'admin' },
    });
    return NextResponse.json([...receiveBets]);
  },
});

export const POST = apiMethod({
  handler: async ({ req, user }) => {
    const zBetFront = () =>
      zBet().omit({
        id: true,
        sender: true,
        betStatus: true,
        createdByUserId: true,
      });
    const parsedBody = zBetFront().parse(await req.json());

    const newBet = await db.bets.create({
      data: {
        ...parsedBody,
        betDeadline: new Date(parsedBody.betDeadline),
        createdAt: new Date(),
        sender: user?.login ?? 'admin',
        betStatus: 'PENDING',
        createdByUserId: user?.id ?? 1,
      },
    });

    return NextResponse.json(newBet);
  },
});
