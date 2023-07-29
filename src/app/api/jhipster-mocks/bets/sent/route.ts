import { NextResponse } from 'next/server';

import { apiMethod } from '@/app/api/jhipster-mocks/_helpers/api';
import { db } from '@/app/api/jhipster-mocks/_helpers/db';

export const GET = apiMethod({
  handler: async ({ user }) => {
    const sendBets = await db.bets.findMany({
      where: { sender: user?.login ?? 'admin' },
    });
    return NextResponse.json([...sendBets]);
  },
});
