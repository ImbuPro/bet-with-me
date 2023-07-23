import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  apiMethod,
  badRequestResponse,
} from '@/app/api/jhipster-mocks/_helpers/api';
import { db } from '@/app/api/jhipster-mocks/_helpers/db';
import {
  formatUserFromDb,
  prepareUserForDb,
  userErrorResponse,
} from '@/app/api/jhipster-mocks/_helpers/user';

export const GET = apiMethod({
  // admin: true,
  handler: async () => {
    const [users, total] = await Promise.all([
      db.user.findMany({
        where: {
          activated: true,
        },
      }),
      db.user.count(),
    ]);

    const headers = new Headers();
    headers.set('x-total-count', total.toString());
    return NextResponse.json(users.map(formatUserFromDb), { headers });
  },
});

export const POST = apiMethod({
  admin: true,
  handler: async ({ req }) => {
    const bodyParsed = z
      .object({
        login: z.string().min(2),
        email: z.string().email(),
        firstName: z.string().nullable(),
        lastName: z.string().nullable(),
        langKey: z.string(),
        authorities: z.array(z.string()),
        activated: z.boolean().optional().default(true),
      })
      .safeParse(await req.json());

    if (!bodyParsed.success) {
      return badRequestResponse({ details: bodyParsed.error });
    }

    try {
      const user = formatUserFromDb(
        await db.user.create({
          data: prepareUserForDb(bodyParsed.data),
        })
      );
      return NextResponse.json(user);
    } catch (e) {
      return userErrorResponse(e);
    }
  },
});

export const PUT = apiMethod({
  admin: true,
  handler: async ({ req }) => {
    const bodyParsed = z
      .object({
        id: z.number(),
        login: z.string().min(2),
        email: z.string().email(),
        firstName: z.string().nullable(),
        lastName: z.string().nullable(),
        langKey: z.string(),
        authorities: z.array(z.string()),
        activated: z.boolean().optional(),
      })
      .safeParse(await req.json());

    if (!bodyParsed.success) {
      return badRequestResponse({ details: bodyParsed.error });
    }

    try {
      const user = formatUserFromDb(
        await db.user.update({
          where: { id: bodyParsed.data.id },
          data: prepareUserForDb(bodyParsed.data),
        })
      );
      return NextResponse.json(user);
    } catch (e) {
      return userErrorResponse(e);
    }
  },
});
